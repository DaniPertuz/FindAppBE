import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Place } from '../../place/entities/place.entity';

export class CreateRatingDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  rate: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  comments: string;

  @IsString()
  place: Place;

  @IsString()
  user: string;
}
