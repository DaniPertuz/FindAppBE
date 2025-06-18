import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  @MaxLength(200)
  description: string;

  @IsArray()
  @IsString()
  category: string;

  @IsString()
  currency: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsMongoId()
  place: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  img?: string;
}
