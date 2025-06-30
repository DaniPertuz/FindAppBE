import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Subscription extends Document {
  @Prop({ required: true })
  placeId: string;

  @Prop({ required: true })
  stripeCustomerId: string;

  @Prop({ required: true })
  stripeSubscriptionId: string;

  @Prop({ required: true })
  premium: number;

  @Prop()
  endDate?: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)
  .set('versionKey', false)
  .set('timestamps', true);
