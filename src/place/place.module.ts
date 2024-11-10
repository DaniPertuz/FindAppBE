import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { Place, PlaceSchema } from './entities/place.entity';

@Module({
  controllers: [PlaceController],
  providers: [PlaceService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Place.name,
        schema: PlaceSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class PlaceModule {}
