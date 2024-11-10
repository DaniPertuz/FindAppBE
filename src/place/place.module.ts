import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { MongooseModule } from '@nestjs/mongoose';
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
})
export class PlaceModule {}
