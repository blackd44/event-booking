import { Controller, Get, BadGatewayException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PaginatorDto, PaginatorResponseDto } from 'src/utils/paginator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: PaginatorResponseDto<User>,
  })
  async findAll(@Query() query: PaginatorDto) {
    const { data, error } = await this.usersService.findAll(query);
    if (error) throw new BadGatewayException(error);
    return data;
  }
}
