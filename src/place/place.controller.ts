import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PaginationDto } from '../common/pagination.dto';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placeService.create(createPlaceDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.placeService.findAll(paginationDto);
  }

  @Get('/popular')
  findPopular(@Query() paginationDto: PaginationDto) {
    return this.placeService.findPopular(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeService.findOne(id);
  }

  @Get('/category/:category')
  findByCategory(
    @Param('category') category: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.placeService.findByCategory(category, paginationDto);
  }

  @Get('/popular')
  findByEmail(@Query() paginationDto: PaginationDto) {
    return this.placeService.findPopular(paginationDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placeService.update(id, updatePlaceDto);
  }

  @Patch('/photo/:id')
  updatePlacePhoto(
    @Param('id') id: string,
    @Body() updatePlacePhoto: UpdatePlaceDto,
  ) {
    return this.placeService.updatePlacePhoto(id, updatePlacePhoto.photo);
  }

  @Patch('/status/:id')
  updatePlaceStatus(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    return this.placeService.updatePlaceStatus(id, updatePlaceDto.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeService.remove(id);
  }
}
