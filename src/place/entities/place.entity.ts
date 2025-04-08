import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Place extends Document {
  @Prop({
    index: true,
    unique: true,
    minlength: 1,
    maxlength: 100,
  })
  name: string;

  @Prop({
    maxlength: 500,
  })
  description: string;

  @Prop({ index: true })
  category: string;

  @Prop({
    index: true,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  })
  email: string;

  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    _id: false,
  })
  coords: { latitude: number; longitude: number };

  @Prop({
    match: /^[0-9]{7,15}$/,
  })
  phone: string;

  @Prop()
  whatsapp?: string;

  @Prop()
  instagram?: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop([String])
  schedule: string[];

  @Prop()
  photo: string;

  @Prop([String])
  pics?: string[];

  @Prop({
    required: true,
    enum: [1, 2, 3],
    default: 1,
  })
  premium: 1 | 2 | 3;

  @Prop({
    min: 0,
    max: 5,
    default: 0,
  })
  rate: number;

  @Prop({
    required: true,
    default: true,
  })
  status: boolean;
}

export const PlaceSchema = SchemaFactory.createForClass(Place)
  .set('versionKey', false)
  .set('timestamps', true);
