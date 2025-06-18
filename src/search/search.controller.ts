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

    const productIds = products.map((pr) => pr._id.toString());
    const placeIds = places.map((pl) => pl._id.toString());

    await this.searchService.registerSearch(keyword, productIds, placeIds);

    return {
      keyword,
      totalPlaces,
      places,
      totalProducts,
      products,
    };
  }

  @Get('logs/:year/:month/:placeId')
  async getLogsByMonthYearAndPlace(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('placeId') placeId: string,
  ) {
    return this.searchService.getSearchesByMonthYearAndPlace(
      +year,
      +month,
      placeId,
    );
  }

  @Get('logs/available/:placeId')
  async getAvailableMonthsAndYears(@Param('placeId') placeId: string) {
    return this.searchService.getAvailable(placeId);
  }

  @Get('logs/monthly/:year/:month/:placeId')
  async getLogsMonthly(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('placeId') placeId: string,
  ) {
    return this.searchService.getMonthlySearch(+year, +month, placeId);
  }
}
