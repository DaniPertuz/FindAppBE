import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { bcryptAdapter } from '../plugins/brcypt.adapter';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = await this.userModel.create({
        ...userData,
        password: bcryptAdapter.hash(password),
      });

      await user.save();
      const userObject = user.toObject();
      delete userObject.password;

      return {
        ...userObject,
        token: this.getJwt({ email: user.email }),
      };
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

  async login(loginUserDto: LoginUserDto): Promise<{
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      status: boolean;
    };
    token: string;
  }> {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userModel
        .findOne({ email })
        .select('_id name email password role status');

      if (!user || !bcryptAdapter.compare(password, user.password)) {
        throw new NotFoundException('Credenciales no son válidas');
      }

      return {
        user: {
          _id: user._id as string,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        token: this.getJwt({ email: user.email }),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al ingresar usuario: ${error}`,
      );
    }
  }

  async checkAuthStatus(user: User) {
    return {
      user,
      token: this.getJwt({ email: user.email }),
    };
  }

  private getJwt(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
