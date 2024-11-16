import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place } from '../place/entities/place.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Place.name) private readonly place: Model<Place>,
    @InjectModel(Product.name) private readonly product: Model<Product>,
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
}
