import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { Booking } from 'src/api/bookings/entities/booking.entity';
import { EUserStatus } from 'src/common/enums/user-status.enum';

@Entity('users')
export class User {
  // @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'User email' })
  @Column({ unique: true })
  email!: string;

  @ApiProperty({ description: 'User first name' })
  @Column()
  firstName!: string;

  @ApiProperty({ description: 'User last name' })
  @Column()
  lastName!: string;

  @ApiProperty({ description: 'User status' })
  @Column({ default: EUserStatus.active, type: String })
  status!: EUserStatus;

  @Column()
  password!: string;

  @ApiProperty({ enum: Role, description: 'User role' })
  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role!: Role;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ description: 'Update timestamp' })
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings!: Booking[];
}
