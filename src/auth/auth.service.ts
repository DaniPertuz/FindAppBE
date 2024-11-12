import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
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
}
