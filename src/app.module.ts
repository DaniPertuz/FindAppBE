import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { envs } from './config';
import { PlaceModule } from './place/place.module';
import { RatingModule } from './rating/rating.module';
import { UserModule } from './user/user.module';
import { JourneyModule } from './journey/journey.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(envs.mongoUrl),
    PlaceModule,
    RatingModule,
    UserModule,
    JourneyModule,
    ProductModule,
  ],
})
export class AppModule {}
