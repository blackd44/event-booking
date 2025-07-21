/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { BadRequestException } from '@nestjs/common';
import { Events } from './entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingStatus } from 'src/common/enums/booking-status.enum';
import { CreateEventDto } from './dto/event.dto';
import { User } from '../users/entities/user.entity';

class UpdateEventDto {
  title?: string;
  description?: string;
  location?: string;
}

class FindEventsDto {
  size?: number;
  start?: number;
  sort_by?: string;
  q?: string;
}

const mockEvent: Events = {
  id: 'event-id',
  title: 'Test Event',
  description: 'Test Desc',
  location: 'Test Location',
  date: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  capacity: 100,
  price: 50.0,
  bookings: [],
};

const mockBooking: Booking = {
  id: 'booking-id',
  // user_id: 'user-id',
  // event_id: 'event-id',
  status: BookingStatus.CONFIRMED,
  quantity: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
  totalAmount: 100.0,
  event: mockEvent,
  user: null as unknown as User,
};

const mockCreateDto: CreateEventDto = {
  title: 'Sample Event',
  description: 'Cool event',
  location: 'Kigali',
  date: new Date(),
  capacity: 100,
  price: 50.0,
};

const mockUpdateDto: UpdateEventDto = {
  title: 'Updated Event Title',
};

const mockFindDto: FindEventsDto = {
  size: 10,
  start: 0,
  sort_by: '-date',
  q: 'Sample',
};

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEventsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getEventBookings: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: mockEventsService }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      mockEventsService.create.mockResolvedValue({
        data: mockEvent,
        error: null,
      });

      const result = await controller.create(mockCreateDto);
      expect(result).toEqual(mockEvent);
      expect(service.create).toHaveBeenCalledWith(mockCreateDto);
    });

    it('should throw BadRequestException on error', async () => {
      mockEventsService.create.mockResolvedValue({
        data: null,
        error: 'Invalid data',
      });

      await expect(controller.create(mockCreateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated events', async () => {
      mockEventsService.findAll.mockResolvedValue({
        data: [mockEvent],
        error: null,
      });

      const result = await controller.findAll(mockFindDto);
      expect(result).toEqual([mockEvent]);
      expect(service.findAll).toHaveBeenCalledWith(mockFindDto);
    });

    it('should throw BadRequestException on error', async () => {
      mockEventsService.findAll.mockResolvedValue({
        data: null,
        error: 'DB error',
      });

      await expect(controller.findAll(mockFindDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return an event', async () => {
      mockEventsService.findOne.mockResolvedValue({ event: mockEvent });

      const result = await controller.findOne('event-id');
      expect(result).toEqual(mockEvent);
      expect(service.findOne).toHaveBeenCalledWith('event-id');
    });
  });

  describe('update', () => {
    it('should update and return the event', async () => {
      mockEventsService.update.mockResolvedValue(mockEvent);

      const result = await controller.update('event-id', mockUpdateDto);
      expect(result).toEqual(mockEvent);
      expect(service.update).toHaveBeenCalledWith('event-id', mockUpdateDto);
    });
  });

  describe('remove', () => {
    it('should delete an event', async () => {
      mockEventsService.remove.mockResolvedValue(undefined);

      await controller.remove('event-id');
      expect(service.remove).toHaveBeenCalledWith('event-id');
    });
  });

  describe('getEventBookings', () => {
    it('should return bookings for an event', async () => {
      mockEventsService.getEventBookings.mockResolvedValue([mockBooking]);

      const result = await controller.getEventBookings('event-id');
      expect(result).toEqual([mockBooking]);
      expect(service.getEventBookings).toHaveBeenCalledWith('event-id');
    });
  });
});
