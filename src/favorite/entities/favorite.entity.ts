import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Place } from '../../place/entities/place.entity';
import { User } from '../../user/entities/user.entity';

@Schema()
export class Favorite extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
  })
  place: Place;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  user: User;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite)
  .set('versionKey', false)
  .set('timestamps', true);
