import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from '../common/pagination.dto';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './entities/place.entity';

@Injectable()
export class PlaceService {
  constructor(
    @InjectModel(Place.name)
    private readonly placeModel: Model<Place>,
  ) {}

  async create(createPlaceDto: CreatePlaceDto) {
    try {
      return await this.placeModel.create(createPlaceDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Error al crear lugar ${JSON.stringify(error.errmsg)}`,
        );
      }

      throw new HttpException(
        `Error al crear lugar: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;

      const [total, places] = await Promise.all([
        this.placeModel.countDocuments({}),
        this.placeModel
          .find({})
          .limit(limit)
          .skip(offset)
          .sort({ premium: -1 }),
      ]);

      return {
        total,
        places,
      };
    } catch (error) {
      throw new HttpException(
        `Error al obtener lugares: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findPopular(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const query = {
        $or: [{ premium: 3 }, { rate: { $gt: 4.0 } }],
        $and: [{ status: true }],
      };

      const [total, places] = await Promise.all([
        this.placeModel.countDocuments(query),
        this.placeModel
          .find(query)
          .limit(limit)
          .skip(offset)
          .sort({ premium: -1 }),
      ]);

      return {
        total,
        places,
      };
    } catch (error) {
      throw new HttpException(
        `Error al obtener lugares populares: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByCategory(category: string, paginationDto: PaginationDto) {
    try {
      const query = { category };
      const { limit = 10, offset = 0 } = paginationDto;

      const [total, places] = await Promise.all([
        this.placeModel.countDocuments(query),
        this.placeModel
          .find(query)
          .limit(limit)
          .skip(offset)
          .sort({ premium: -1 })
          .select('-createdAt -updatedAt'),
      ]);

      return {
        total,
        places,
      };
    } catch (error) {
      throw new HttpException(
        `Error al obtener lugares: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.placeModel.findById(id);
    } catch (error) {
      throw new HttpException(
        `Error al obtener lugar: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.placeModel
        .findById({ email })
        .select('-createdAt -updatedAt');
    } catch (error) {
      throw new HttpException(
        `Error al obtener lugar: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    try {
      const updatedPlace = await this.placeModel.findByIdAndUpdate(
        id,
        updatePlaceDto,
        { new: true },
      );

      if (!updatedPlace) {
        throw new HttpException('Lugar no encontrado', HttpStatus.NOT_FOUND);
      }

      return updatedPlace;
    } catch (error) {
      throw new HttpException(
        `Error al obtener lugar: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePlacePhoto(id: string, photo: string) {
    try {
      if (!photo || typeof photo !== 'string') {
        throw new HttpException(
          'No se suministró URL de foto',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedPlace = await this.placeModel.findByIdAndUpdate(
        id,
        { photo },
        { new: true },
      );

      if (!updatedPlace) {
        throw new HttpException(
          'No se encontró el lugar',
          HttpStatus.BAD_REQUEST,
        );
      }

      return updatedPlace;
    } catch (error) {
      throw new HttpException(
        `Error al actualizar foto: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePlaceStatus(id: string, status: boolean) {
    try {
      if (!status || typeof status !== 'boolean') {
        throw new HttpException(
          'Nuevo estado incorrecto',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.placeModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );
    } catch (error) {
      throw new HttpException(
        `Error al actualizar estado del lugar: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const place = await this.findOne(id);
      if (!place) {
        throw new HttpException(
          'No existe el lugar con ese ID',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.placeModel.findByIdAndDelete(id, { new: true });
    } catch (error) {
      throw new HttpException(
        `Error al eliminar lugar: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
