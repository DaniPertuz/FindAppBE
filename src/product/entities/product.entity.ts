import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Place } from '../../place/entities/place.entity';

@Schema()
export class Product extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: false,
  })
  description: string;

  @Prop([String])
  categories: string[];

  @Prop({
    required: false,
  })
  observation?: string;

  @Prop({
    required: true,
  })
  currency: string;

  @Prop({
    required: true,
  })
  price: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
  })
  place: Place;

  @Prop({
    default: 0,
  })
  rate: number;

  @Prop({
    required: false,
  })
  img?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product)
  .set('versionKey', false)
  .set('timestamps', true);
