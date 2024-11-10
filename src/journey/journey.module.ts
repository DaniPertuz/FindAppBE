import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JourneyController } from './journey.controller';
import { JourneyService } from './journey.service';
import { Journey, JourneySchema } from './entities/journey.entity';

@Module({
  controllers: [JourneyController],
  providers: [JourneyService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Journey.name,
        schema: JourneySchema,
      },
    ]),
  ],
})
export class JourneyModule {}
