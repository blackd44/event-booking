/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Role } from 'src/common/enums/role.enum';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  me: jest.fn(),
};

const mockUser = {
  id: 'uuid-user-id',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: Role.CUSTOMER,
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(LocalAuthGuard)
      .useValue({
        canActivate: (ctx: any) => {
          ctx.switchToHttp().getRequest().user = mockUser;
          return true;
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('register()', () => {
    it('should call authService.register and return user', async () => {
      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'securePass123',
        role: Role.CUSTOMER,
      });

      expect(mockAuthService.register).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('login()', () => {
    it('should call authService.login and return tokens', () => {
      mockAuthService.login.mockReturnValue({ access_token: 'jwt.token' });

      const result = controller.login({ user: mockUser } as any, {} as any);

      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ access_token: 'jwt.token' });
    });
  });

  describe('me()', () => {
    it('should return current user', async () => {
      mockAuthService.me.mockResolvedValue(mockUser);

      const result = await controller.me({ user: mockUser } as any);
      expect(mockAuthService.me).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
