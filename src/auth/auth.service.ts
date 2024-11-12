import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
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

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userModel
        .findOne({ email })
        .select('email password');

      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new NotFoundException('Credenciales no son válidas');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al ingresar usuario: ${error}`,
      );
    }
  }
}
