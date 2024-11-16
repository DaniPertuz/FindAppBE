import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PlaceModule } from 'src/place/place.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [PlaceModule, ProductModule],
})
export class SearchModule {}
