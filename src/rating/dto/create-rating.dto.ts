import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Place } from '../../place/entities/place.entity';
import { User } from '../../user/entities/user.entity';

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

  @IsMongoId()
  place: Place;

  @IsMongoId()
  user: User;
}
