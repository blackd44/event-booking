import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { User } from '../users/entities/user.entity';
import { EUserStatus } from 'src/common/enums/user-status.enum';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser: User = {
    id: 'user-id-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: Role.CUSTOMER,
    password: 'hashedPassword',
    status: EUserStatus.active,
    createdAt: new Date(),
    updatedAt: new Date(),
    bookings: [],
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('signed-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should throw if user already exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      await expect(
        service.register({
          email: mockUser.email,
          password: 'somepass',
          firstName: 'John',
          lastName: 'Doe',
          role: Role.CUSTOMER,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a new user and return token', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pass');
      (usersService.create as jest.Mock).mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const result = await service.register({
        email: mockUser.email,
        password: 'somepass',
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: Role.CUSTOMER,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('somepass', 10);
      expect(result).toEqual({
        access_token: 'signed-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
          status: mockUser.status,
        },
      });
    });

    it('should throw if create returns error', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pass');
      (usersService.create as jest.Mock).mockResolvedValue({
        data: null,
        error: 'Something failed',
      });

      await expect(
        service.register({
          email: mockUser.email,
          password: 'somepass',
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: Role.CUSTOMER,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, 'password');
      const { password, ...others } = mockUser;
      expect(result).toEqual(others);
    });

    it('should return null if password invalid', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(mockUser.email, 'wrong-pass');
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      const result = await service.validateUser(mockUser.email, 'pass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return token and user', () => {
      const result = service.login(mockUser);
      expect(result).toEqual({
        access_token: 'signed-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
          status: mockUser.status,
        },
      });
    });
  });

  describe('me', () => {
    it('should return user if found', async () => {
      (usersService.findById as jest.Mock).mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const result = await service.me(mockUser);
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
          status: mockUser.status,
        },
      });
    });

    it('should throw if user not found or error exists', async () => {
      (usersService.findById as jest.Mock).mockResolvedValue({
        data: null,
        error: 'Something wrong',
      });

      await expect(service.me(mockUser)).rejects.toThrow(ConflictException);
    });
  });
});
