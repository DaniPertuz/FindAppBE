import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':keyword')
  async search(@Param('keyword') keyword: string) {
    const { totalPlaces, places } =
      await this.searchService.getPlacesByKeyword(keyword);
    const { totalProducts, products } =
      await this.searchService.getProductsByKeyword(keyword);

    return {
      keyword,
      totalPlaces,
      places,
      totalProducts,
      products,
    };
  }
}
