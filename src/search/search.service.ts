import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Place } from '../place/entities/place.entity';
import { Product } from '../product/entities/product.entity';
import { SearchLog } from './entities/search.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Place.name) private readonly place: Model<Place>,
    @InjectModel(Product.name) private readonly product: Model<Product>,
    @InjectModel(SearchLog.name) private readonly searchLog: Model<SearchLog>,
  ) {}

  private buildSearchPipeline(
    keyword: string,
    index: string,
    paths: string[],
    projectFields: Record<string, any>,
    additionalStages: any[] = [],
  ) {
    return [
      {
        $search: {
          index,
          compound: {
            must: [
              {
                text: {
                  query: keyword,
                  path: paths,
                  fuzzy: {},
                },
              },
            ],
          },
        },
      },
      ...additionalStages,
      {
        $project: {
          ...projectFields,
          score: { $meta: 'searchScore' },
        },
      },
    ];
  }

  async getPlacesByKeyword(keyword: string) {
    const projectFields = {
      name: 1,
      description: 1,
      category: 1,
      coords: 1,
      address: 1,
      phone: 1,
      city: 1,
      state: 1,
      country: 1,
      schedule: 1,
      pics: 1,
      rate: 1,
      photo: 1,
      premium: 1,
    };

    const searchPipeline = this.buildSearchPipeline(
      keyword,
      'places-search',
      ['name', 'description', 'category'],
      projectFields,
    );

    const [totalPlaces, places] = await Promise.all([
      this.place.aggregate([...searchPipeline, { $count: 'totalPlaces' }]),
      this.place.aggregate([...searchPipeline, { $sort: { premium: -1 } }]),
    ]);

    return { totalPlaces: totalPlaces[0]?.totalPlaces || 0, places };
  }

  async getProductsByKeyword(keyword: string) {
    const projectFields = {
      name: 1,
      description: 1,
      category: 1,
      rate: 1,
      img: 1,
      price: 1,
      place: 1,
    };

    const lookupStage = {
      $lookup: {
        from: 'places',
        localField: 'place',
        foreignField: '_id',
        as: 'place',
      },
    };

    const searchPipeline = this.buildSearchPipeline(
      keyword,
      'products-search',
      ['name', 'description', 'category'],
      projectFields,
      [lookupStage],
    );

    const [totalProducts, products] = await Promise.all([
      this.product.aggregate([...searchPipeline, { $count: 'totalProducts' }]),
      this.product.aggregate(searchPipeline),
    ]);

    return { totalProducts: totalProducts[0]?.totalProducts || 0, products };
  }

  async registerSearch(
    keyword: string,
    productIds: string[] = [],
    placeIds: string[] = [],
  ) {
    for (const productId of productIds) {
      const product = await this.product.findById(productId).select('place');
      const placeId = product?.place?.toString();

      await this.searchLog.create({
        keyword,
        productId,
        placeId,
      });
    }

    if (productIds.length === 0 && placeIds.length > 0) {
      for (const placeId of placeIds) {
        await this.searchLog.create({
          keyword,
          placeId,
        });
      }
    }
  }

  async getAvailable(placeId: string) {
    const placeObjectId = new Types.ObjectId(placeId);

    const logs = await this.searchLog.aggregate([
      {
        $match: { placeId: placeObjectId },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
        },
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1,
        },
      },
    ]);

    const monthNames = [
      '',
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const groupedByYear: Record<number, { month: number; name: string }[]> = {};

    for (const log of logs) {
      const year = log._id.year;
      const month = log._id.month;
      const name = monthNames[month];

      if (!groupedByYear[year]) {
        groupedByYear[year] = [];
      }

      if (!groupedByYear[year].some((m) => m.month === month)) {
        groupedByYear[year].push({ month, name });
      }
    }

    return Object.entries(groupedByYear).map(([year, months]) => ({
      year: +year,
      months,
    }));
  }

  async getSearchesByMonthYearAndPlace(
    year: number,
    month: number,
    placeId: string,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const placeObjectId = new Types.ObjectId(placeId);

    const logs = await this.searchLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          placeId: placeObjectId,
        },
      },
      {
        $group: {
          _id: '$keyword',
          count: { $sum: 1 },
          productIds: { $addToSet: '$productId' },
        },
      },
      {
        $project: {
          keyword: '$_id',
          count: 1,
          productIds: 1,
          _id: 0,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productIds',
          foreignField: '_id',
          as: 'products',
        },
      },
      {
        $addFields: {
          placeId: placeObjectId,
        },
      },
      {
        $lookup: {
          from: 'places',
          localField: 'placeId',
          foreignField: '_id',
          as: 'place',
        },
      },
      {
        $unwind: '$place',
      },
      {
        $project: {
          keyword: 1,
          count: 1,
          products: 1,
          place: 1,
        },
      },
    ]);

    const result = {
      total: logs.length,
      keywords: logs.map((log) => ({
        keyword: log.keyword,
        count: log.count,
      })),
    };

    return result;
  }

  async getMonthlySearch(year: number, month: number, placeId: string) {
    const placeObjectId = new Types.ObjectId(placeId);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const results = await this.searchLog.aggregate([
      {
        $match: {
          placeId: placeObjectId,
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $addFields: {
          day: { $dayOfMonth: '$createdAt' },
        },
      },
      {
        $addFields: {
          weekOfMonth: {
            $ceil: { $divide: ['$day', 7] },
          },
        },
      },
      {
        $group: {
          _id: '$weekOfMonth',
          count: { $sum: 1 },
          keywords: { $addToSet: '$keyword' },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          week: '$_id',
          count: 1,
          keywords: 1,
          _id: 0,
        },
      },
    ]);

    const completeWeeks = Array.from({ length: 5 }, (_, i) => {
      const week = i + 1;
      const found = results.find((res) => res.week === week);
      return (
        found ?? {
          week,
          count: 0,
          keywords: [],
        }
      );
    });

    return completeWeeks;
  }
}
