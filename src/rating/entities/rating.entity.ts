import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Place } from '../../place/entities/place.entity';
import { User } from '../../user/entities/user.entity';

@Schema()
export class Rating extends Document {
  @Prop({
    required: true,
    min: 1,
    max: 5,
  })
  rate: number;

  @Prop()
  comments: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
  })
  place: Place;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;
}

export const RatingSchema = SchemaFactory.createForClass(Rating)
  .set('versionKey', false)
  .set('timestamps', true);
