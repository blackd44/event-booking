import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Req() req: Request, @Body() _: LoginDto) {
    return this.authService.login(req.user as User);
  }
}
