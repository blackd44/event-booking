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
import { CreateBookingDto, FindBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { PaginatorResponseDto } from 'src/utils/paginator';

@Controller()
@ApiTags('bookings')
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
  async findUserBookings(@Req() req: Request) {
    return this.bookingsService.findUserBookings(req?.user?.id || '');
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Get all bookings (admin only)',
    type: PaginatorResponseDto<Booking>,
  })
  async findAll(@Query() query: FindBookingDto, @Req() req: Request) {
    const isAdmin = req?.user?.role === Role.ADMIN;

    const { data, error } = await this.bookingsService.findAll({
      ...query,
      user_id: isAdmin ? query?.user_id : req?.user?.id,
    });
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
