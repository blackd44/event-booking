import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { UsersModule, UsersRoutes } from './users/users.module';
import { AuthModule, AuthRoutes } from './auth/auth.module';
import { EventsModule, EventsRoutes } from './events/events.module';
import { BookingsModule, BookingsRoutes } from './bookings/bookings.module';
import { Routes } from '@nestjs/core';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [UsersModule, AuthModule, EventsModule, BookingsModule],
})
export class ApiModule {}

export const ApiRoutes: Routes = [
  {
    path: '',
    module: ApiModule,
    children: [
      ...AuthRoutes,
      ...UsersRoutes,
      ...EventsRoutes,
      ...BookingsRoutes,
    ],
  },
];
