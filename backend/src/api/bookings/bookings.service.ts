import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto, FindBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { EventsService } from '../events/events.service';
import { BookingStatus } from 'src/common/enums/booking-status.enum';
import { PaginatorResponse, Paginators } from 'src/utils/paginator';
import { errorMessage } from 'src/utils/error';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private eventsService: EventsService,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const { event } = await this.eventsService.findOne(
      createBookingDto.eventId,
    );

    const quantity = createBookingDto.quantity ?? 1;

    // Check if event is in the future
    if (event.date <= new Date())
      throw new BadRequestException('Cannot book tickets for past events');

    // Check available capacity
    const availableSpots = await this.eventsService.getAvailableSpots(
      createBookingDto.eventId,
    );
    if (availableSpots < quantity)
      throw new BadRequestException(`Only ${availableSpots} spots available`);

    const totalAmount = event.price * quantity;

    const booking = this.bookingRepository.create({
      quantity,
      totalAmount,
      user: { id: userId },
      event: { id: createBookingDto.eventId },
    });

    return this.bookingRepository.save(booking);
  }

  async findUserBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    if (!booking) throw new NotFoundException('Booking not found');

    return booking;
  }

  async cancelBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id);

    // Check if user owns the booking
    if (booking.user.id !== userId)
      throw new ForbiddenException('You can only cancel your own bookings');

    // Check if booking is already cancelled
    if (booking.status === BookingStatus.CANCELLED)
      throw new BadRequestException('Booking is already cancelled');

    // Check if event is in the future (allow cancellation only for future events)
    if (booking.event.date <= new Date())
      throw new BadRequestException('Cannot cancel booking for past events');

    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }

  async findAll(params: FindBookingDto) {
    try {
      const { user_id } = params;
      const { skip, limit, sorts } = Paginators(params);

      const [data, count] = await this.bookingRepository.findAndCount({
        where: { ...(user_id ? { user: { id: user_id } } : {}) },
        relations: ['user', 'event'],
        order: sorts,
        skip: skip,
        take: limit,
      });

      return { data: PaginatorResponse(data, count, limit, skip) };
    } catch (error) {
      return { error: errorMessage(error) };
    }
  }
}
