import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/pagination.dto';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { Model } from 'mongoose';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<Favorite>,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
    try {
      return await this.favoriteModel.create(createFavoriteDto);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear favorito: ${error}`,
      );
    }
  }

  async findAllByPlace(placeId: string, paginationDto: PaginationDto) {
    try {
      const query = { place: placeId };
      const { limit = 10, offset = 0 } = paginationDto;

      const [total, favorites] = await Promise.all([
        this.favoriteModel.countDocuments(query),
        this.favoriteModel
          .find(query)
          .limit(limit)
          .skip(offset)
          .select('-place'),
      ]);

      const page = offset === 0 ? 1 : Math.floor(offset / limit) + 1;

      return this.paginationResponse(
        total,
        favorites,
        limit,
        page,
        `/favorites/place/${placeId}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener favoritos por lugar: ${error}`,
      );
    }
  }

  async findAllByUser(userId: string, paginationDto: PaginationDto) {
    try {
      const query = { user: userId };
      const { limit = 10, offset = 0 } = paginationDto;

      const [total, favorites] = await Promise.all([
        this.favoriteModel.countDocuments(query),
        this.favoriteModel
          .find(query)
          .limit(limit)
          .skip(offset)
          .select('-user'),
      ]);

      const page = offset === 0 ? 1 : Math.floor(offset / limit) + 1;

      return this.paginationResponse(
        total,
        favorites,
        limit,
        page,
        `/favorites/user/${userId}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener favoritos por usuario: ${error}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.favoriteModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener favorito: ${error}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const favorite = await this.findOne(id);

      if (!favorite) {
        throw new NotFoundException(`No existe el favorito con ID ${id}`);
      }

      return await this.favoriteModel.findByIdAndDelete(id, { new: true });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar lugar: ${error}`,
      );
    }
  }

  private paginationResponse(
    total: number,
    favorites: Favorite[],
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
      favorites,
    };
  }
}
