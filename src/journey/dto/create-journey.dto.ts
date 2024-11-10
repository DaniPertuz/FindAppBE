import { IsMongoId, IsString } from 'class-validator';

export class CreateJourneyDto {
  @IsString()
  search: string;

  @IsMongoId()
  place: string;

  @IsMongoId()
  user: string;
}
