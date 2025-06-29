import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentSessionItemDto } from './payment-session-item.dto';
import { Type } from 'class-transformer';

export class PaymentSessionDto {
  @IsString()
  placeId: string;

  @IsNumber()
  @IsPositive()
  plan: number;

  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentSessionItemDto)
  items: PaymentSessionItemDto[];
}
