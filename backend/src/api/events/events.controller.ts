import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, FindEventsDto, UpdateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { PaginatorResponseDto } from 'src/utils/paginator';
import { Events } from './entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: Events,
  })
  async create(@Body() createEventDto: CreateEventDto) {
    const { data, error } = await this.eventsService.create(createEventDto);
    if (error) throw new BadRequestException(error);
    return data;
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all upcoming events',
    type: PaginatorResponseDto<Events>,
  })
  async findAll(@Query() query: FindEventsDto) {
    const { data, error } = await this.eventsService.findAll(query);
    if (error) throw new BadRequestException(error);
    return data;
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get event details', type: Events })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string) {
    const { event } = await this.eventsService.findOne(id);
    return event;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: Events,
  })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventsService.remove(id);
  }

  @Get(':id/bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get all bookings for event',
    type: [Booking],
  })
  async getEventBookings(@Param('id') id: string) {
    return this.eventsService.getEventBookings(id);
  }
}
