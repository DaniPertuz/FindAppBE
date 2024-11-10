import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Place } from '../../place/entities/place.entity';
import { User } from '../../user/entities/user.entity';

@Schema()
export class Journey extends Document {
  @Prop({
    required: true,
  })
  search: string;

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

export const JourneySchema = SchemaFactory.createForClass(Journey)
  .set('versionKey', false)
  .set('timestamps', true);
