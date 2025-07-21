/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { Events } from './entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CreateEventDto, FindEventsDto, UpdateEventDto } from './dto/event.dto';
import { BookingStatus } from 'src/common/enums/booking-status.enum';
import { User } from '../users/entities/user.entity';

// Mock the utility functions
jest.mock('src/utils/error', () => ({
  errorMessage: jest.fn(
    (error, message?: string) => message || 'Error occurred',
  ),
}));

// jest.mock('src/utils/paginator', () => ({
//   Paginators: jest.fn(() => ({
//     skip: 0,
//     limit: 10,
//     sorts: { date: 1 },
//   })),
//   PaginatorResponse: jest.fn(
//     <T>(data: T[], count: number, limit: number, skip: number) => ({
//       results: data,
//       total: count,
//       start: skip,
//       end: skip + data.length,
//       size: limit,
//     }),
//   ),
// }));

// jest.mock('src/utils/query', () => ({
//   getMinMaxFilter: jest.fn((min, max) => {
//     if (min && max) return { $gte: min, $lte: max };
//     if (min) return { $gte: min };
//     if (max) return { $lte: max };
//     return null;
//   }),
//   mergeWhere: jest.fn((searchWhere, normalWhere) =>
//     searchWhere.length > 0
//       ? searchWhere.map((sw) => ({ ...sw, ...normalWhere }))
//       : normalWhere,
//   ),
// }));

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: jest.Mocked<Repository<Events>>;
  let bookingRepository: jest.Mocked<Repository<Booking>>;

  const mockEvent: Events = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Event',
    description: 'Test Description',
    location: 'Test Location',
    date: new Date('2024-12-25'),
    capacity: 100,
    price: 50.0,
    createdAt: new Date(),
    updatedAt: new Date(),
    bookings: [],
    availableSpots: 90,
  };

  const mockBooking: Booking = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    quantity: 1,
    totalAmount: 50.0,
    status: BookingStatus.CONFIRMED,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: null as unknown as User,
    event: mockEvent,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Events),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            count: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get(getRepositoryToken(Events));
    bookingRepository = module.get(getRepositoryToken(Booking));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create an event', async () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        description: 'New Description',
        location: 'New Location',
        date: new Date('2024-12-30'),
        capacity: 50,
        price: 25.0,
      };

      eventRepository.create.mockReturnValue(mockEvent);
      eventRepository.save.mockResolvedValue(mockEvent);

      const result = await service.create(createEventDto);

      expect(eventRepository.create).toHaveBeenCalledWith(createEventDto);
      expect(eventRepository.save).toHaveBeenCalledWith(mockEvent);
      expect(result).toEqual({ data: mockEvent });
    });

    it('should handle creation errors', async () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        description: 'New Description',
        location: 'New Location',
        date: new Date('2024-12-30'),
        capacity: 50,
        price: 25.0,
      };

      const error = new Error('Database error');
      eventRepository.create.mockReturnValue(mockEvent);
      eventRepository.save.mockRejectedValue(error);

      const result = await service.create(createEventDto);

      expect(result).toEqual({ error: 'Event creation failed' });
    });
  });

  describe('findAll', () => {
    it('should return paginated events with available spots calculated', async () => {
      const findEventsDto: FindEventsDto = {
        size: 10,
        start: 0,
      };

      const mockEvents = [mockEvent];
      eventRepository.findAndCount.mockResolvedValue([mockEvents, 1]);
      bookingRepository.count.mockResolvedValue(10); // 10 confirmed bookings

      const result = await service.findAll(findEventsDto);

      expect(eventRepository.findAndCount).toHaveBeenCalled();
      expect(bookingRepository.count).toHaveBeenCalledWith({
        where: {
          event: { id: mockEvent.id },
          status: BookingStatus.CONFIRMED,
        },
      });
      expect(mockEvents[0].availableSpots).toBe(90); // 100 capacity - 10 bookings
      expect(result.data).toBeDefined();
    });

    it('should filter events by search query', async () => {
      const findEventsDto: FindEventsDto = {
        q: 'Test',
        size: 10,
        start: 0,
      };

      const mockEvents = [mockEvent];
      eventRepository.findAndCount.mockResolvedValue([mockEvents, 1]);
      bookingRepository.count.mockResolvedValue(5);

      const result = await service.findAll(findEventsDto);

      expect(result.data).toBeDefined();
      expect(mockEvents[0].availableSpots).toBe(95);
    });

    it('should filter events by date range', async () => {
      const findEventsDto: FindEventsDto = {
        min_date: '2024-12-01',
        max_date: '2024-12-31',
        size: 10,
        start: 0,
      };

      const mockEvents = [mockEvent];
      eventRepository.findAndCount.mockResolvedValue([mockEvents, 1]);
      bookingRepository.count.mockResolvedValue(0);

      const result = await service.findAll(findEventsDto);

      expect(result.data).toBeDefined();
      expect(mockEvents[0].availableSpots).toBe(100);
    });

    it('should handle errors in findAll', async () => {
      const findEventsDto: FindEventsDto = {};
      const error = new Error('Database error');

      eventRepository.findAndCount.mockRejectedValue(error);

      const result = await service.findAll(findEventsDto);

      expect(result).toEqual({ error: 'Error occurred' });
    });
  });

  describe('findOne', () => {
    it('should return an event with available spots', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';

      eventRepository.findOne.mockResolvedValue(mockEvent);
      bookingRepository.count.mockResolvedValue(15);

      const result = await service.findOne(eventId);

      expect(eventRepository?.findOne).toHaveBeenCalledWith({
        where: { id: eventId },
      });
      expect(bookingRepository?.count).toHaveBeenCalledWith({
        where: {
          event: { id: eventId },
          status: BookingStatus.CONFIRMED,
        },
      });
      expect(result.event.availableSpots).toBe(85);
      expect(result.bookedCount).toBe(15);
    });

    it('should throw NotFoundException when event not found', async () => {
      const eventId = 'non-existent-id';

      eventRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(eventId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(eventId)).rejects.toThrow('Event not found');
    });
  });

  describe('update', () => {
    it('should update an event successfully', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';
      const updateEventDto: UpdateEventDto = {
        title: 'Updated Event Title',
        capacity: 150,
      };

      eventRepository.findOne.mockResolvedValue(mockEvent);
      bookingRepository.count.mockResolvedValue(10);

      const updatedEvent = { ...mockEvent, ...updateEventDto };
      eventRepository.save.mockResolvedValue(updatedEvent);

      const result = await service.update(eventId, updateEventDto);

      expect(eventRepository.save).toHaveBeenCalledWith({
        ...mockEvent,
        ...updateEventDto,
        availableSpots: 90,
      });
      expect(result).toEqual(updatedEvent);
    });

    it('should throw NotFoundException when updating non-existent event', async () => {
      const eventId = 'non-existent-id';
      const updateEventDto: UpdateEventDto = { title: 'New Title' };

      eventRepository.findOne.mockResolvedValue(null);

      await expect(service.update(eventId, updateEventDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an event successfully', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';

      eventRepository.findOne.mockResolvedValue(mockEvent);
      bookingRepository.count.mockResolvedValue(5);
      eventRepository.remove.mockResolvedValue(mockEvent);

      await service.remove(eventId);

      expect(eventRepository.remove).toHaveBeenCalledWith({
        ...mockEvent,
        availableSpots: 145,
      });
    });

    it('should throw NotFoundException when removing non-existent event', async () => {
      const eventId = 'non-existent-id';

      eventRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(eventId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getEventBookings', () => {
    it('should return bookings for a specific event', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';
      const mockBookings = [mockBooking];

      eventRepository.findOne.mockResolvedValue(mockEvent);
      bookingRepository.count.mockResolvedValue(1);
      bookingRepository.find.mockResolvedValue(mockBookings);

      const result = await service.getEventBookings(eventId);

      expect(bookingRepository?.find).toHaveBeenCalledWith({
        where: { event: { id: eventId } },
        relations: ['user'],
      });
      expect(result).toEqual(mockBookings);
    });

    it('should throw NotFoundException for non-existent event', async () => {
      const eventId = 'non-existent-id';

      eventRepository.findOne.mockResolvedValue(null);

      await expect(service.getEventBookings(eventId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAvailableSpots', () => {
    it('should return available spots for an event', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';

      eventRepository.findOne.mockResolvedValue(mockEvent);
      bookingRepository.count.mockResolvedValue(25);

      const result = await service.getAvailableSpots(eventId);

      expect(result).toBe(125); // 150 capacity - 25 bookings
    });

    it('should throw NotFoundException for non-existent event', async () => {
      const eventId = 'non-existent-id';

      eventRepository.findOne.mockResolvedValue(null);

      await expect(service.getAvailableSpots(eventId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('edge cases', () => {
    it('should handle zero available spots', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';

      eventRepository.findOne.mockResolvedValue(mockEvent);
      bookingRepository.count.mockResolvedValue(150); // Full capacity

      const result = await service.getAvailableSpots(eventId);

      expect(result).toBe(0);
    });

    it('should handle events with no bookings', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';

      eventRepository.findOne.mockResolvedValue(mockEvent);
      bookingRepository.count.mockResolvedValue(0);

      const result = await service.getAvailableSpots(eventId);

      expect(result).toBe(150); // Full capacity available
    });

    it('should handle findAll with empty results', async () => {
      const findEventsDto: FindEventsDto = {};

      eventRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll(findEventsDto);

      expect(result.data).toBeDefined();
      expect(result?.data?.results).toEqual([]);
      expect(result?.data?.total).toBe(0);
    });
  });
});
