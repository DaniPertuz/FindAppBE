import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

      throw new InternalServerErrorException(`Error al crear lugar: ${error}`);
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
      throw new InternalServerErrorException(
        `Error al obtener lugares: ${error}`,
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
      throw new InternalServerErrorException(
        `Error al obtener lugares populares: ${error}`,
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
      throw new InternalServerErrorException(
        `Error al obtener lugares por categoría: ${error}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.placeModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener lugar: ${error}`,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.placeModel
        .findById({ email })
        .select('-createdAt -updatedAt');
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener lugar por email: ${error}`,
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
        throw new NotFoundException('Lugar no encontrado');
      }

      return updatedPlace;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener lugar: ${error}`,
      );
    }
  }

  async updatePlacePhoto(id: string, photo: string) {
    try {
      if (!photo || typeof photo !== 'string') {
        throw new BadRequestException('No se suministró URL de foto');
      }

      const updatedPlace = await this.placeModel.findByIdAndUpdate(
        id,
        { photo },
        { new: true },
      );

      if (!updatedPlace) {
        throw new NotFoundException('No se encontró el lugar');
      }

      return updatedPlace;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar foto: ${error}`,
      );
    }
  }

  async updatePlaceStatus(id: string, status: boolean) {
    try {
      if (!status || typeof status !== 'boolean') {
        throw new BadRequestException('Nuevo estado incorrecto');
      }

      return await this.placeModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar estado del lugar: ${error}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const place = await this.findOne(id);

      if (!place) {
        throw new NotFoundException('No existe el lugar con ese ID');
      }

      return await this.placeModel.findByIdAndDelete(id, { new: true });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar lugar: ${error}`,
      );
    }
  }
}
