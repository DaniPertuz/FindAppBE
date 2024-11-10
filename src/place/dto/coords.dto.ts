import { IsNumber, IsNotEmpty } from 'class-validator';

export class CoordsDto {
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
