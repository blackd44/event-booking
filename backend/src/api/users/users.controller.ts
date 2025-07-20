import {
  Controller,
  Get,
  BadGatewayException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PaginatorDto, PaginatorResponseDto } from 'src/utils/paginator';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
