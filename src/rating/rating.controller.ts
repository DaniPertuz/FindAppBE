import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PaginationDto } from '../common/pagination.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.create(createRatingDto);
  }

  @Get('/place/:id')
  findRatingsByPlace(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ratingService.findRatingsByPlace(id, paginationDto);
  }

  @Get('/user/:id')
  findRatingsByUser(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ratingService.findRatingsByUser(id, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(id);
  }

  @Get('/place/avg/:id')
  findRatingByPlace(@Param('id') id: string) {
    return this.ratingService.getRatingsAverage(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingService.update(id, updateRatingDto);
  }
}
