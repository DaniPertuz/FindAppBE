import { IsMongoId } from 'class-validator';
import { Place } from '../../place/entities/place.entity';
import { User } from '../../user/entities/user.entity';

export class CreateFavoriteDto {
  @IsMongoId()
  place: Place;

  @IsMongoId()
  user: User;
}
