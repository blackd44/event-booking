import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { BookingStatus } from 'src/common/enums/booking-status.enum';
import { Events } from 'src/api/events/entities/event.entity';

@Entity('bookings')
export class Booking {
  // @ApiProperty({ description: 'Booking ID' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Number of tickets' })
  @Column('int', { default: 1 })
  quantity!: number;

  @ApiProperty({ description: 'Total amount' })
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount!: number;

  @ApiProperty({ enum: BookingStatus, description: 'Booking status' })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status!: BookingStatus;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ description: 'Update timestamp' })
  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.bookings)
  user!: User;

  @ManyToOne(() => Events, (event) => event.bookings)
  event!: Events;
}
