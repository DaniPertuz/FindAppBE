import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Place } from '../place/entities/place.entity';
import { Rating } from './entities/rating.entity';
import { PaginationDto } from '../common/pagination.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name)
    private readonly ratingModel: Model<Rating>,
    @InjectModel(Place.name)
    private readonly placeModel: Model<Place>,
  ) {}

  async create(createRatingDto: CreateRatingDto) {
    try {
      const ratingDB = new this.ratingModel(createRatingDto);
      await ratingDB.save();

      const { place } = createRatingDto;
      const { average } = await this.getRatingsAverage(place.id);

      await this.placeModel.findByIdAndUpdate(
        place,
        { rate: average },
        { new: true },
      );

      return ratingDB;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear evaluación: ${error}`,
      );
    }
  }

  async findRatingsByPlace(placeID: string, paginationDto: PaginationDto) {
    try {
      const query = { place: placeID };
      const { limit = 10, offset = 1 } = paginationDto;

      const [total, ratings] = await Promise.all([
        this.ratingModel.countDocuments(query),
        this.ratingModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip((offset - 1) * limit)
          .limit(limit)
          .populate('user', 'name photo -_id')
          .populate('place', 'name -_id')
          .select('-updatedAt')
          .exec(),
      ]);

      return this.paginationResponse(
        total,
        ratings,
        limit,
        offset,
        `ratings/place/${placeID}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener evaluaciones: ${error}`,
      );
    }
  }

  async findRatingsByUser(userID: string, paginationDto: PaginationDto) {
    try {
      const query = { user: userID };
      const { limit = 10, offset = 0 } = paginationDto;

      const [total, ratings] = await Promise.all([
        this.ratingModel.countDocuments(query),
        this.ratingModel
          .find(query)
          .populate('user', 'name photo -_id')
          .populate('place', 'name -_id')
          .limit(limit)
          .skip((offset - 1) * limit)
          .select('-updatedAt'),
      ]);

      return this.paginationResponse(
        total,
        ratings,
        limit,
        offset,
        `ratings/user/${userID}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener evaluaciones: ${error}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      return this.ratingModel
        .findById(id)
        .populate('user', 'name photo -_id')
        .populate('place', 'name -_id');
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener evaluación: ${error}`,
      );
    }
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    try {
      const updatedRating = await this.ratingModel.findByIdAndUpdate(
        id,
        updateRatingDto,
        { new: true },
      );

      if (!updatedRating) {
        throw new NotFoundException('Evaluación no encontrada');
      }

      return updatedRating;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar evaluación: ${error}`,
      );
    }
  }

  async getRatingsAverage(placeId: string) {
    const average = await this.ratingModel.aggregate([
      { $match: { place: new mongoose.Types.ObjectId(placeId) } },
      { $group: { _id: '$place', average: { $avg: '$rate' } } },
      { $project: { _id: 0, average: 1 } },
    ]);

    return average[0] ? average[0] : { average: 0 };
  }

  private paginationResponse(
    total: number,
    ratings: Rating[],
    limit: number,
    offset: number,
    basePath: string,
  ) {
    return {
      page: offset,
      limit,
      total,
      next:
        offset * limit < total
          ? `${basePath}?offset=${offset + 1}&limit=${limit}`
          : null,
      prev:
        offset - 1 > 0
          ? `${basePath}?offset=${offset - 1}&limit=${limit}`
          : null,
      ratings,
    };
  }
}
