import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { PaginationDto } from '../common/pagination.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get('roles')
  findByRole(
    @Body() body: { roles: string[]; limit?: number; offset?: number },
  ) {
    const { roles, limit, offset } = body;
    return this.userService.findByRole(roles, { limit, offset });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('user/email')
  findOneByEmail(@Body() body: { email: string }) {
    return this.userService.findOneByEmail(body.email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('user/password')
  updatePassword(@Body() body: { email: string; password: string }) {
    return this.userService.updatePassword(body.email, body.password);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
