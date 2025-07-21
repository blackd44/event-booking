/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { EventsService } from '../events/events.service';
import { CreateBookingDto, FindBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from 'src/common/enums/booking-status.enum';
import { Events } from '../events/entities/event.entity';

// Mock the utility functions
jest.mock('src/utils/error', () => ({
  errorMessage: jest.fn((error, message) => message || 'Error occurred'),
}));

jest.mock('src/utils/paginator', () => ({
  Paginators: jest.fn((params) => ({
    skip: 0,
    limit: 10,
    sorts: { createdAt: 'DESC' },
  })),
  PaginatorResponse: jest.fn((data, count, limit, skip) => ({
    results: data,
    total: count,
    start: skip,
    end: skip + data.length,
    size: limit,
  })),
}));

jest.mock('src/utils/query', () => ({
  mergeWhere: jest.fn((where, additionalWhere) => ({
    ...where,
    ...additionalWhere,
  })),
}));

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepository: jest.Mocked<Repository<Booking>>;
  let eventsService: jest.Mocked<EventsService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockEvent: Events = {
    id: 'event-123',
    title: 'Test Event',
    description: 'Test Description',
    location: 'Test Location',
    date: new Date('2025-12-25'), // Future date
    capacity: 100,
    price: 50.0,
    createdAt: new Date(),
    updatedAt: new Date(),
    bookings: [],
    availableSpots: 90,
  };

  const mockPastEvent: Events = {
    ...mockEvent,
    id: 'past-event-123',
    date: new Date('2023-12-25'), // Past date
  };

  const mockBooking: Booking = {
    id: 'booking-123',
    quantity: 2,
    totalAmount: 100.0,
    status: BookingStatus.CONFIRMED,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser as any,
    event: mockEvent,
  };

  const mockCancelledBooking: Booking = {
    ...mockBooking,
    id: 'cancelled-booking-123',
    status: BookingStatus.CANCELLED,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
            count: jest.fn(),
            sum: jest.fn(),
          },
        },
        {
          provide: EventsService,
          useValue: {
            findOne: jest.fn(),
            getAvailableSpots: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepository = module.get(getRepositoryToken(Booking));
    eventsService = module.get(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createBookingDto: CreateBookingDto = {
      eventId: 'event-123',
      quantity: 2,
    };

    it('should create a booking successfully', async () => {
      eventsService.findOne.mockResolvedValue({
        event: mockEvent,
        bookedCount: 10,
      });
      eventsService.getAvailableSpots.mockResolvedValue(90);
      bookingRepository.create.mockReturnValue(mockBooking);
      bookingRepository.save.mockResolvedValue(mockBooking);

      const result = await service.create(createBookingDto, mockUser.id);

      expect(eventsService.findOne).toHaveBeenCalledWith(
        createBookingDto.eventId,
      );
      expect(eventsService.getAvailableSpots).toHaveBeenCalledWith(
        createBookingDto.eventId,
      );
      expect(bookingRepository.create).toHaveBeenCalledWith({
        quantity: 2,
        totalAmount: 100.0, // 50 * 2
        user: { id: mockUser.id },
        event: { id: createBookingDto.eventId },
      });
      expect(bookingRepository.save).toHaveBeenCalledWith(mockBooking);
      expect(result).toEqual(mockBooking);
    });

    it('should use default quantity of 1 when not provided', async () => {
      const dtoWithoutQuantity = { eventId: 'event-123' };

      eventsService.findOne.mockResolvedValue({
        event: mockEvent,
        bookedCount: 10,
      });
      eventsService.getAvailableSpots.mockResolvedValue(90);
      bookingRepository.create.mockReturnValue(mockBooking);
      bookingRepository.save.mockResolvedValue(mockBooking);

      await service.create(dtoWithoutQuantity, mockUser.id);

      expect(bookingRepository.create).toHaveBeenCalledWith({
        quantity: 1,
        totalAmount: 50.0,
        user: { id: mockUser.id },
        event: { id: dtoWithoutQuantity.eventId },
      });
    });

    it('should throw BadRequestException for past events', async () => {
      eventsService.findOne.mockResolvedValue({
        event: mockPastEvent,
        bookedCount: 10,
      });

      await expect(
        service.create(createBookingDto, mockUser.id),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(createBookingDto, mockUser.id),
      ).rejects.toThrow('Cannot book tickets for past events');
    });

    it('should throw BadRequestException when insufficient spots available', async () => {
      eventsService.findOne.mockResolvedValue({
        event: mockEvent,
        bookedCount: 99,
      });
      eventsService.getAvailableSpots.mockResolvedValue(1);

      await expect(
        service.create(createBookingDto, mockUser.id),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(createBookingDto, mockUser.id),
      ).rejects.toThrow('Only 1 spots available');
    });

    it('should throw NotFoundException for non-existent event', async () => {
      eventsService.findOne.mockRejectedValue(
        new NotFoundException('Event not found'),
      );

      await expect(
        service.create(createBookingDto, mockUser.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserBookings', () => {
    it('should return user bookings ordered by creation date', async () => {
      const mockBookings = [mockBooking];
      bookingRepository.find.mockResolvedValue(mockBookings);

      const result = await service.findUserBookings(mockUser.id);

      expect(bookingRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ['event'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockBookings);
    });

    it('should return empty array when user has no bookings', async () => {
      bookingRepository.find.mockResolvedValue([]);

      const result = await service.findUserBookings('user-without-bookings');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a booking with relations', async () => {
      bookingRepository.findOne.mockResolvedValue(mockBooking);

      const result = await service.findOne('booking-123');

      expect(bookingRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'booking-123' },
        relations: ['user', 'event'],
      });
      expect(result).toEqual(mockBooking);
    });

    it('should throw NotFoundException when booking not found', async () => {
      bookingRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-booking')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-booking')).rejects.toThrow(
        'Booking not found',
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking successfully', async () => {
      bookingRepository.findOne.mockResolvedValue(mockBooking);
      const updatedBooking = {
        ...mockBooking,
        status: BookingStatus.CANCELLED,
      };
      bookingRepository.save.mockResolvedValue(updatedBooking);

      const result = await service.cancelBooking('booking-123', mockUser.id);

      expect(bookingRepository.save).toHaveBeenCalledWith({
        ...mockBooking,
        status: BookingStatus.CANCELLED,
      });
      expect(result.status).toBe(BookingStatus.CANCELLED);
    });

    it("should throw ForbiddenException when user tries to cancel someone else's booking", async () => {
      const otherUserBooking = {
        ...mockBooking,
        user: { ...mockUser, id: 'other-user' },
      };
      bookingRepository.findOne.mockResolvedValue(otherUserBooking as any);

      await expect(
        service.cancelBooking('booking-123', mockUser.id),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.cancelBooking('booking-123', mockUser.id),
      ).rejects.toThrow('You can only cancel your own bookings');
    });

    it('should throw BadRequestException when booking is already cancelled', async () => {
      bookingRepository.findOne.mockResolvedValue(mockCancelledBooking);

      await expect(
        service.cancelBooking('cancelled-booking-123', mockUser.id),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.cancelBooking('cancelled-booking-123', mockUser.id),
      ).rejects.toThrow('Booking is already cancelled');
    });

    it('should throw BadRequestException for past event booking cancellation', async () => {
      const pastEventBooking = { ...mockBooking, event: mockPastEvent };
      bookingRepository.findOne.mockResolvedValue(pastEventBooking);

      await expect(
        service.cancelBooking('booking-123', mockUser.id),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.cancelBooking('booking-123', mockUser.id),
      ).rejects.toThrow('Cannot cancel booking for past events');
    });

    it('should throw NotFoundException when booking not found', async () => {
      bookingRepository.findOne.mockResolvedValue(null);

      await expect(
        service.cancelBooking('non-existent-booking', mockUser.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const mockBookings = [mockBooking];

    it('should return paginated bookings without stats', async () => {
      const params: FindBookingDto = {
        size: 10,
        start: 0,
      };

      bookingRepository.findAndCount.mockResolvedValue([mockBookings, 1]);

      const result = await service.findAll(params);

      expect(bookingRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        relations: ['user', 'event'],
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
      expect(result.data).toHaveProperty('results');
      expect(result.data).not.toHaveProperty('stats');
    });

    it('should return bookings with stats when show_stats is true', async () => {
      const params: FindBookingDto = {
        size: 10,
        start: 0,
        show_stats: true,
      };

      bookingRepository.findAndCount.mockResolvedValue([mockBookings, 1]);
      bookingRepository.count
        .mockResolvedValueOnce(5) // confirmed
        .mockResolvedValueOnce(3) // upcoming
        .mockResolvedValueOnce(2); // cancelled
      bookingRepository.sum.mockResolvedValue(500);

      const result = await service.findAll(params);

      expect(result.data).toHaveProperty('stats');
      expect(result?.data?.stats).toEqual({
        confirmed: 5,
        cancelled: 2,
        revenue: 500,
        upComming: 3,
      });
    });

    it('should filter by user_id when provided', async () => {
      const params: FindBookingDto = {
        user_id: 'user-123',
      };

      bookingRepository.findAndCount.mockResolvedValue([mockBookings, 1]);

      await service.findAll(params);

      expect(bookingRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: 'user-123' } },
        relations: ['user', 'event'],
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter by status when provided', async () => {
      const params: FindBookingDto = {
        status: BookingStatus.CONFIRMED,
      };

      bookingRepository.findAndCount.mockResolvedValue([mockBookings, 1]);

      await service.findAll(params);

      expect(bookingRepository.findAndCount).toHaveBeenCalledWith({
        where: { status: BookingStatus.CONFIRMED },
        relations: ['user', 'event'],
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
    });

    it('should apply search query across multiple fields', async () => {
      const params: FindBookingDto = {
        q: 'test search',
      };

      bookingRepository.findAndCount.mockResolvedValue([mockBookings, 1]);

      await service.findAll(params);

      // The search should create multiple where conditions for different fields
      expect(bookingRepository.findAndCount).toHaveBeenCalled();
      const callArgs = bookingRepository.findAndCount.mock.calls[0][0];
      expect(Array.isArray(callArgs?.where)).toBe(true);
    });

    it('should combine filters when multiple parameters provided', async () => {
      const params: FindBookingDto = {
        user_id: 'user-123',
        status: BookingStatus.CONFIRMED,
        q: 'test',
      };

      bookingRepository.findAndCount.mockResolvedValue([mockBookings, 1]);

      await service.findAll(params);

      expect(bookingRepository.findAndCount).toHaveBeenCalled();
    });

    it('should handle revenue as null and return 0', async () => {
      const params: FindBookingDto = {
        show_stats: true,
      };

      bookingRepository.findAndCount.mockResolvedValue([mockBookings, 1]);
      bookingRepository.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);
      bookingRepository.sum.mockResolvedValue(null);

      const result = await service.findAll(params);

      expect(result?.data?.stats?.revenue).toBe(0);
    });

    it('should handle errors and return error message', async () => {
      const params: FindBookingDto = {};
      const error = new Error('Database error');

      bookingRepository.findAndCount.mockRejectedValue(error);

      const result = await service.findAll(params);

      expect(result).toEqual({ error: 'Error occurred' });
    });

    it('should return empty results when no bookings found', async () => {
      const params: FindBookingDto = {};

      bookingRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll(params);

      expect(result?.data?.results).toEqual([]);
      expect(result?.data?.total).toBe(0);
    });
  });

  describe('edge cases and business logic', () => {
    it('should calculate correct total amount for different quantities', async () => {
      const createBookingDto: CreateBookingDto = {
        eventId: 'event-123',
        quantity: 5,
      };

      eventsService.findOne.mockResolvedValue({
        event: { ...mockEvent, price: 25.5 },
        bookedCount: 10,
      });
      eventsService.getAvailableSpots.mockResolvedValue(90);
      bookingRepository.create.mockReturnValue(mockBooking);
      bookingRepository.save.mockResolvedValue(mockBooking);

      await service.create(createBookingDto, mockUser.id);

      expect(bookingRepository.create).toHaveBeenCalledWith({
        quantity: 5,
        totalAmount: 127.5, // 25.50 * 5
        user: { id: mockUser.id },
        event: { id: createBookingDto.eventId },
      });
    });

    it('should handle exact capacity booking', async () => {
      const createBookingDto: CreateBookingDto = {
        eventId: 'event-123',
        quantity: 1,
      };

      eventsService.findOne.mockResolvedValue({
        event: mockEvent,
        bookedCount: 99,
      });
      eventsService.getAvailableSpots.mockResolvedValue(1); // Exactly 1 spot left

      bookingRepository.create.mockReturnValue(mockBooking);
      bookingRepository.save.mockResolvedValue(mockBooking);

      const result = await service.create(createBookingDto, mockUser.id);

      expect(result).toEqual(mockBooking);
    });

    it('should handle booking on event scheduled for today', async () => {
      const todayEvent = {
        ...mockEvent,
        date: new Date(), // Today's date
      };

      const createBookingDto: CreateBookingDto = {
        eventId: 'event-123',
        quantity: 1,
      };

      eventsService.findOne.mockResolvedValue({
        event: todayEvent,
        bookedCount: 10,
      });

      await expect(
        service.create(createBookingDto, mockUser.id),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
