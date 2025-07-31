import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from 'src/api/bookings/entities/booking.entity';
import { EventStatus } from 'src/common/enums/event-status.enum';

@Entity('events')
export class Events {
  // @ApiProperty({ description: 'Event ID' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Event title' })
  @Column()
  title!: string;

  @ApiProperty({ description: 'Event description' })
  @Column('text')
  description!: string;

  @ApiProperty({ description: 'Event location' })
  @Column()
  location!: string;

  @ApiProperty({ description: 'Event date and time' })
  @Column('timestamp')
  date!: Date;

  @ApiProperty({ description: 'Maximum capacity' })
  @Column('int')
  capacity!: number;

  @ApiProperty({
    description: `Event status, ${Object.values(EventStatus).join(' | ')}`,
  })
  @Column({ type: String, default: EventStatus.CONFIRMED })
  status!: EventStatus;

  @ApiProperty({ description: 'Ticket price' })
  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ description: 'Update timestamp' })
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings!: Booking[];

  @ApiProperty({ description: 'Available spots' })
  availableSpots?: number;
}
