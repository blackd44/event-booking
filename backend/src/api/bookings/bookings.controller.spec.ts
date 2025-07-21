/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BadRequestException } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { BookingStatus } from 'src/common/enums/booking-status.enum';
import { PaginatorDto } from 'src/utils/paginator';

// ─────────────────────────────────────────────────────────────────────────────
// 📦 DTO & Entity Mocks

class CreateBookingDto {
  eventId!: string;
  quantity!: number;
}

class FindBookingDto extends PaginatorDto {
  user_id?: string;
  show_stats?: boolean;
  status?: BookingStatus;
  q?: string;
}

const mockBooking = {
  id: 'booking-id',
  user_id: 'user-id',
  event_id: 'event-id',
  quantity: 2,
  status: BookingStatus.CONFIRMED,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockCreateBookingDto: CreateBookingDto = {
  eventId: 'event-id',
  quantity: 2,
};

const mockFindBookingDto: FindBookingDto = {
  size: 10,
  start: 0,
  sort_by: '-createdAt',
  user_id: 'user-id',
  q: 'searchTerm',
  show_stats: true,
  status: BookingStatus.CANCELLED,
};

const mockRequest = (user = { id: 'user-id', role: Role.CUSTOMER }) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  ({ user }) as any;

// ─────────────────────────────────────────────────────────────────────────────
// 🧪 Test Suite

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  const mockBookingsService = {
    create: jest.fn(),
    findUserBookings: jest.fn(),
    findAll: jest.fn(),
    cancelBooking: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: mockBookingsService }],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking', async () => {
      mockBookingsService.create.mockResolvedValue(mockBooking);

      const result = await controller.create(
        mockCreateBookingDto,
        mockRequest(),
      );
      expect(result).toEqual(mockBooking);
      expect(mockBookingsService.create).toHaveBeenCalledWith(
        mockCreateBookingDto,
        'user-id',
      );
    });
  });

  describe('findUserBookings', () => {
    it('should return user bookings', async () => {
      mockBookingsService.findUserBookings.mockResolvedValue([mockBooking]);

      const result = await controller.findUserBookings(mockRequest());
      expect(result).toEqual([mockBooking]);
      expect(mockBookingsService.findUserBookings).toHaveBeenCalledWith(
        'user-id',
      );
    });
  });

  describe('findAll', () => {
    it('should return all bookings for admin', async () => {
      const req = mockRequest({ id: 'admin-id', role: Role.ADMIN });

      const mockResponse = { data: [mockBooking], error: null };
      mockBookingsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(mockFindBookingDto, req);
      expect(result).toEqual([mockBooking]);
      expect(mockBookingsService.findAll).toHaveBeenCalledWith({
        ...mockFindBookingDto,
        user_id: mockFindBookingDto.user_id,
      });
    });

    it('should return bookings for normal user ignoring query.user_id', async () => {
      const req = mockRequest({ id: 'user-id', role: Role.CUSTOMER });

      const mockResponse = { data: [mockBooking], error: null };
      mockBookingsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(mockFindBookingDto, req);
      expect(result).toEqual([mockBooking]);
      expect(mockBookingsService.findAll).toHaveBeenCalledWith({
        ...mockFindBookingDto,
        user_id: 'user-id',
      });
    });

    it('should throw BadRequestException if service returns error', async () => {
      const req = mockRequest({ id: 'user-id', role: Role.CUSTOMER });

      mockBookingsService.findAll.mockResolvedValue({
        data: null,
        error: 'Something went wrong',
      });

      await expect(controller.findAll(mockFindBookingDto, req)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking', async () => {
      mockBookingsService.cancelBooking.mockResolvedValue(mockBooking);

      const result = await controller.cancelBooking(
        'booking-id',
        mockRequest(),
      );
      expect(result).toEqual(mockBooking);
      expect(mockBookingsService.cancelBooking).toHaveBeenCalledWith(
        'booking-id',
        'user-id',
      );
    });
  });
});
