/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadGatewayException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { EUserStatus } from 'src/common/enums/user-status.enum';
import { Role } from 'src/common/enums/role.enum';

// ─────────────────────────────────────────────────────────────────────────────
// 📦 DTO & Entity Mocks

class FindUserDto {
  q?: string;
  show_bookings?: boolean;
  size?: number;
  start?: number;
  sort_by?: string;
}

const mockUser: User = {
  id: 'user-id',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'hashed_password',
  status: EUserStatus.active,
  role: Role.CUSTOMER,
  createdAt: new Date(),
  updatedAt: new Date(),
  bookings: [],
};

const mockFindUserDto: FindUserDto = {
  q: 'john',
  show_bookings: true,
  size: 10,
  start: 0,
  sort_by: '-created_at',
};

// ─────────────────────────────────────────────────────────────────────────────
// 🧪 Test Suite

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated list of users', async () => {
      const mockResponse = { data: [mockUser], error: null };
      mockUsersService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(mockFindUserDto);
      expect(result).toEqual([mockUser]);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(mockFindUserDto);
    });

    it('should throw BadGatewayException if service returns error', async () => {
      mockUsersService.findAll.mockResolvedValue({
        data: null,
        error: 'Service failure',
      });

      await expect(controller.findAll(mockFindUserDto)).rejects.toThrow(
        BadGatewayException,
      );
    });
  });
});
