import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Place } from '../place/entities/place.entity';
import { Rating } from './entities/rating.entity';

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
      throw new HttpException(
        `Error al crear evaluación: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRatingsByPlace(placeID: string) {
    try {
      const query = { place: placeID };

      const [total, ratings] = await Promise.all([
        this.ratingModel.countDocuments(query),
        this.ratingModel
          .find(query)
          .populate('user', 'name photo -_id')
          .select('-place -updatedAt')
          .sort({ createdAt: -1 }),
      ]);

      return {
        total,
        ratings,
      };
    } catch (error) {
      throw new HttpException(
        `Error al obtener evaluaciones: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
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
      throw new HttpException(
        `Error al obtener evaluación: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
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
        throw new HttpException(
          'Evaluación no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      return updatedRating;
    } catch (error) {
      throw new HttpException(
        `Error al actualizar evaluación: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
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
}
