import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto, FindEventsDto, UpdateEventDto } from './dto/event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from './entities/event.entity';
import { errorMessage } from 'src/utils/error';
import { PaginatorResponse, Paginators } from 'src/utils/paginator';
import { getMinMaxFilter } from 'src/utils/query';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventRepository: Repository<Events>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    try {
      const event = this.eventRepository.create(createEventDto);
      const data = await this.eventRepository.save(event);
      return { data };
    } catch (error) {
      return { error: errorMessage(error, 'Event creation failed') };
    }
  }

  async findAll(params: FindEventsDto) {
    try {
      const { min_date, max_date } = params;

      const { skip, limit, sorts } = Paginators({
        ...params,
        sort_by: params?.sort_by || 'date',
      });

      const minDate = min_date ? new Date(min_date) : null;
      const maxDate = max_date ? new Date(max_date) : null;
      const dateFilter = getMinMaxFilter(minDate, maxDate);

      const [events, count] = await this.eventRepository.findAndCount({
        where: { ...(dateFilter ? { date: dateFilter } : {}) },
        order: sorts,
        skip: skip,
        take: limit,
      });

      return { data: PaginatorResponse(events, count, limit, skip) };
    } catch (error) {
      return { error: errorMessage(error) };
    }
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    return { event };
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const { event } = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const { event } = await this.findOne(id);
    await this.eventRepository.remove(event);
  }
}
