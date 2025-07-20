import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { EventsModule } from '../events/events.module';
import { Routes } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), EventsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}

export const BookingsRoutes: Routes = [
  { path: 'bookings', module: BookingsModule },
];
