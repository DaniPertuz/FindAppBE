import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class SearchLog extends Document {
  @Prop({ required: true }) keyword: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productId?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Place' })
  placeId?: string;

  @Prop()
  source: 'product' | 'place';
}

export const SearchLogSchema = SchemaFactory.createForClass(SearchLog)
  .set('versionKey', false)
  .set('timestamps', true);
