import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { PaginatorDto, PaginatorResponseDto } from 'src/utils/paginator';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: Booking,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - insufficient capacity or past event',
  })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: Request,
  ): Promise<Booking> {
    return this.bookingsService.create(createBookingDto, req?.user?.id || '');
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get user bookings',
    type: [Booking],
  })
  async findUserBookings(@Req() req: Request): Promise<Booking[]> {
    return this.bookingsService.findUserBookings(req?.user?.id || '');
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Get all bookings (admin only)',
    type: PaginatorResponseDto<Booking>,
  })
  async findAll(@Query() query: PaginatorDto) {
    const { data, error } = await this.bookingsService.findAll(query);
    if (error) throw new BadRequestException(error);
    return data;
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    type: Booking,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not your booking' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - already cancelled or past event',
  })
  async cancelBooking(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Booking> {
    return this.bookingsService.cancelBooking(id, req?.user?.id || '');
  }
}
