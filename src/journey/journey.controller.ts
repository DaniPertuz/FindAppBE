import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JourneyService } from './journey.service';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { PaginationDto } from '../common/pagination.dto';

@Controller('journeys')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Post()
  create(@Body() createJourneyDto: CreateJourneyDto) {
    return this.journeyService.create(createJourneyDto);
  }

  @Get('place/:id')
  findByPlace(@Param('id') id: string, @Query() paginationDto: PaginationDto) {
    return this.journeyService.findJourneysByPlace(id, paginationDto);
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string, @Query() paginationDto: PaginationDto) {
    return this.journeyService.findJourneysByUser(id, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journeyService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journeyService.remove(id);
  }
}
