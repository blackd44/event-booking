import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { BookingsService } from '../bookings/bookings.service';
import { CreateUserDto, FindUserDto } from './dto/user.dto';

describe('UsersService', () => {
  let service: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: Repository<User>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let bookingsService: BookingsService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  const mockBookingsService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    bookingsService = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    };

    it('should create a user successfully', async () => {
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ data: mockUser });
    });

    it('should handle creation errors', async () => {
      const error = new Error('Database error');
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockRejectedValue(error);

      const result = await service.create(createUserDto);

      expect(result).toEqual({ error: 'Database error' });
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const email = 'notfound@example.com';
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id successfully', async () => {
      const userId = '1';
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual({ data: mockUser });
    });

    it('should return error when user not found', async () => {
      const userId = '999';
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(userId);

      expect(result).toEqual({ error: 'User not found' });
    });

    it('should handle database errors', async () => {
      const userId = '1';
      const error = new Error('Database connection failed');
      mockUserRepository.findOne.mockRejectedValue(error);

      const result = await service.findById(userId);

      expect(result).toEqual({ error: 'Database connection failed' });
    });
  });

  describe('findAll', () => {
    const mockUsers = [
      mockUser,
      { ...mockUser, id: '2', email: 'test2@example.com' },
    ];
    const findUserDto: FindUserDto = {
      size: 10,
      start: 0,
    };

    it('should find all users without search query', async () => {
      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      const result = await service.findAll(findUserDto);

      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: -1 }, // Default sort
        skip: 0,
        take: 10,
      });

      expect(result.data).toEqual({
        results: mockUsers,
        total: 2,
        start: 0,
        end: 2,
        size: 10,
      });
    });

    it('should find users with search query', async () => {
      const searchDto: FindUserDto = {
        ...findUserDto,
        q: 'John',
      };

      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 1]);

      await service.findAll(searchDto);

      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
        where: [
          {
            email: expect.objectContaining({
              _type: 'ilike',
              _value: '%John%',
            }),
          },
          {
            firstName: expect.objectContaining({
              _type: 'ilike',
              _value: '%John%',
            }),
          },
          {
            lastName: expect.objectContaining({
              _type: 'ilike',
              _value: '%John%',
            }),
          },
        ],
        order: { createdAt: -1 },
        skip: 0,
        take: 10,
      });
    });

    it('should include bookings count when show_bookings is true', async () => {
      const searchDto: FindUserDto = {
        ...findUserDto,
        show_bookings: 'true' as unknown as boolean,
      };

      mockUserRepository.findAndCount.mockResolvedValue([[mockUser], 1]);
      mockBookingsService.findAll.mockResolvedValue({
        data: { total: 5 },
      });

      const result = await service.findAll(searchDto);

      expect(mockBookingsService.findAll).toHaveBeenCalledWith({
        user_id: mockUser.id,
        size: 0,
      });

      expect(result?.data?.results[0]).toEqual({
        ...mockUser,
        bookingsCount: 5,
      });
    });

    it('should handle bookings count when bookings service returns no data', async () => {
      const searchDto: FindUserDto = {
        ...findUserDto,
        show_bookings: true,
      };

      mockUserRepository.findAndCount.mockResolvedValue([[mockUser], 1]);
      mockBookingsService.findAll.mockResolvedValue({
        data: null,
      });

      const result = await service.findAll(searchDto);

      expect(result?.data?.results[0]).toEqual({
        ...mockUser,
        bookingsCount: 0,
      });
    });

    it('should handle pagination correctly', async () => {
      const paginatedDto: FindUserDto = {
        size: 5,
        start: 10,
        sort_by: 'firstName',
      };

      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 20]);

      const result = await service.findAll(paginatedDto);

      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { firstName: 1 },
        skip: 10,
        take: 5,
      });

      expect(result.data).toEqual({
        results: mockUsers,
        total: 20,
        start: 10,
        end: 12,
        size: 5,
      });
    });

    it('should handle errors in findAll', async () => {
      const error = new Error('Database error');
      mockUserRepository.findAndCount.mockRejectedValue(error);

      const result = await service.findAll(findUserDto);

      expect(result).toEqual({ error: 'Database error' });
    });

    it('should handle errors when fetching bookings', async () => {
      const searchDto: FindUserDto = {
        ...findUserDto,
        show_bookings: true,
      };

      mockUserRepository.findAndCount.mockResolvedValue([[mockUser], 1]);
      mockBookingsService.findAll.mockRejectedValue(
        new Error('Bookings service error'),
      );

      const result = await service.findAll(searchDto);

      // Should still return users even if bookings fetch fails
      expect(result).toEqual({ error: 'Bookings service error' });
    });
  });
});
