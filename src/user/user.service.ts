import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/pagination.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await user.save();
      const userObject = user.toObject();
      delete userObject.password;

      return userObject;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Error al crear usuario ${JSON.stringify(error.errmsg)}`,
        );
      }

      throw new InternalServerErrorException(
        `Error al crear usuario: ${error}`,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const query = { role: { $ne: 'management' } };

      const [total, users] = await Promise.all([
        this.userModel.countDocuments(query),
        this.userModel
          .find(query)
          .limit(limit)
          .skip(offset)
          .select('-createdAt -updatedAt'),
      ]);

      const page = offset === 0 ? 1 : Math.floor(offset / limit) + 1;

      return this.paginationResponse(total, users, limit, page, 'users');
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener usuarios: ${error}`,
      );
    }
  }

  async findByRole(roles: string[], paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const query = { role: { $in: roles } };

      const [total, users] = await Promise.all([
        this.userModel.countDocuments(query),
        this.userModel
          .find(query)
          .limit(limit)
          .skip(offset)
          .select('-createdAt -updatedAt'),
      ]);

      const page = offset === 0 ? 1 : Math.floor(offset / limit) + 1;

      return this.paginationResponse(total, users, limit, page, 'users/roles');
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener usuarios por roles ${roles}: ${error}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById(id).select('-password');
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener usuario: ${error}`,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email }).select('-password');
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener usuario por email: ${error}`,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true },
      );

      if (!updatedUser) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener usuario: ${error}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new NotFoundException('No existe el usuario con ese ID');
      }

      return await this.userModel.findByIdAndDelete(id, { new: true });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar usuario: ${error}`,
      );
    }
  }

  private paginationResponse(
    total: number,
    users: User[],
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
      users,
    };
  }
}
