import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PlaceModule } from '../place/place.module';
import { ProductModule } from '../product/product.module';
import { SearchLog, SearchLogSchema } from './entities/search.entity';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [
    MongooseModule.forFeature([
      { name: SearchLog.name, schema: SearchLogSchema },
    ]),
    PlaceModule,
    ProductModule,
  ],
})
export class SearchModule {}
