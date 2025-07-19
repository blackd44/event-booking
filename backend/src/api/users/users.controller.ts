import { Controller, Get, BadGatewayException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Get all users', type: [User] })
  async findAll() {
    const { data, error } = await this.usersService.findAll();
    if (error) throw new BadGatewayException(error);
    return data;
  }
}
