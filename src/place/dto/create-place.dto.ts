import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { CoordsDto } from './coords.dto';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  category: string[];

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @Type(() => CoordsDto)
  @IsNotEmpty()
  coords: CoordsDto;

  @IsNumberString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsArray()
  schedule: string[];

  @IsString()
  @IsOptional()
  photo?: string;

  @IsArray()
  @IsOptional()
  pics?: string[];

  @IsNumber()
  @IsNotEmpty()
  @IsIn([1, 2, 3])
  @IsOptional()
  premium: 1 | 2 | 3;

  @IsNumber()
  @IsOptional()
  rate: number;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}
