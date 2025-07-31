import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto, FindEventsDto, UpdateEventDto } from './dto/event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Events } from './entities/event.entity';
import { errorMessage } from 'src/utils/error';
import { PaginatorResponse, Paginators } from 'src/utils/paginator';
import { getMinMaxFilter, mergeWhere } from 'src/utils/query';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingStatus } from 'src/common/enums/booking-status.enum';
import moment from 'moment';
import { EventStatus } from 'src/common/enums/event-status.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventRepository: Repository<Events>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private dataSource: DataSource,
  ) {}

  async create(createEventDto: CreateEventDto) {
    try {
      const date = moment(createEventDto?.date).utc();
      if (moment().utc().isAfter(date))
        throw new Error('Cannot create events in the Past');

      const event = this.eventRepository.create(createEventDto);
      const data = await this.eventRepository.save(event);
      return { data };
    } catch (error) {
      return { error: errorMessage(error, 'Event creation failed') };
    }
  }

  async findAll(params: FindEventsDto) {
    try {
      const { min_date, max_date, status, q } = params;

      const { skip, limit, sorts } = Paginators({
        ...params,
        sort_by: params?.sort_by || '-date',
      });

      let minDate = min_date ? moment(min_date).toDate() : null;
      let maxDate = max_date ? moment(max_date).toDate() : null;

      if (
        minDate &&
        moment(minDate).hour() === 0 &&
        moment(minDate).minute() === 0
      ) {
        minDate = moment(minDate).startOf('day').toDate();
      }
      if (
        maxDate &&
        moment(maxDate).hour() === 0 &&
        moment(maxDate).minute() === 0
      ) {
        maxDate = moment(maxDate).endOf('day').toDate();
      }

      const dateFilter = getMinMaxFilter(minDate, maxDate);

      const searchWhere: FindOptionsWhere<Events>[] = q
        ? [
            { title: ILike(`%${q}%`) },
            { description: ILike(`%${q}%`) },
            { location: ILike(`%${q}%`) },
          ]
        : [];

      const normalWhere: FindOptionsWhere<Events> = {
        ...(dateFilter ? { date: dateFilter } : {}),
        ...(status ? { status } : {}),
      };
      const where = mergeWhere(searchWhere, normalWhere);

      const [events, count] = await this.eventRepository.findAndCount({
        where,
        order: sorts,
        skip: skip,
        take: limit,
      });

      // Calculate available spots for each event
      for (const event of events) {
        const bookedCount = await this.bookingRepository.count({
          where: {
            event: { id: event.id },
            status: BookingStatus.CONFIRMED,
          },
        });
        event.availableSpots = event.capacity - bookedCount;
      }

      return { data: PaginatorResponse(events, count, limit, skip) };
    } catch (error) {
      return { error: errorMessage(error) };
    }
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    // Calculate available spots
    const bookedCount = await this.bookingRepository.count({
      where: {
        event: { id: event.id },
        status: BookingStatus.CONFIRMED,
      },
    });
    event.availableSpots = event.capacity - bookedCount;

    return { event, bookedCount };
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const { event } = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async delete(id: string) {
    const { event } = await this.findOne(id);

    if (!event) throw new NotFoundException('Event not found');

    event.status = EventStatus.CANCELLED;

    await this.dataSource.transaction(async (manager) => {
      await manager.update(
        Booking,
        { event: { id } },
        { status: BookingStatus.CANCELLED },
      );
      await manager.update(Events, { id }, { status: EventStatus.CANCELLED });
    });
  }

  async remove(id: string) {
    const { event } = await this.findOne(id);
    await this.eventRepository.remove(event);
  }

  async getEventBookings(eventId: string) {
    await this.findOne(eventId);
    return this.bookingRepository.find({
      where: { event: { id: eventId } },
      relations: ['user'],
    });
  }

  async getAvailableSpots(eventId: string) {
    const { event, bookedCount } = await this.findOne(eventId);

    return event.capacity - bookedCount;
  }
}
