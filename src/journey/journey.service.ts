import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { Journey } from './entities/journey.entity';
import { PaginationDto } from '../common/pagination.dto';

@Injectable()
export class JourneyService {
  constructor(
    @InjectModel(Journey.name)
    private readonly journeyModel: Model<Journey>,
  ) {}

  async create(createJourneyDto: CreateJourneyDto) {
    try {
      return await this.journeyModel.create(createJourneyDto);
    } catch (error) {
      throw new InternalServerErrorException(`Error al crear viaje: ${error}`);
    }
  }

  async findJourneysByPlace(placeID: string, paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const query = { place: placeID };

      const [total, journeys] = await Promise.all([
        this.journeyModel.countDocuments(query),
        this.journeyModel.find(query).limit(limit).skip(offset),
      ]);

      return {
        total,
        journeys,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener viajes por lugar: ${error}`,
      );
    }
  }

  async findJourneysByUser(userID: string, paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const query = { user: userID };

      const [total, journeys] = await Promise.all([
        this.journeyModel.countDocuments(query),
        this.journeyModel.find(query).limit(limit).skip(offset),
      ]);

      return {
        total,
        journeys,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener viajes por usuario: ${error}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.journeyModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener viaje: ${error}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const journey = await this.findOne(id);

      if (!journey) {
        throw new NotFoundException('No existe el viaje con ese ID');
      }

      return await this.journeyModel.findByIdAndDelete(id, { new: true });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar viaje: ${error}`,
      );
    }
  }
}
