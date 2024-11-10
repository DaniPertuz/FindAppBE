import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    index: true,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  photo?: string;

  @Prop({
    required: true,
    enum: ['management', 'admin', 'place', 'client'],
  })
  role: string;

  @Prop({
    required: true,
    default: true,
  })
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User)
  .set('versionKey', false)
  .set('timestamps', true);
