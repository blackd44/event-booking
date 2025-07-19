import { IsUUID, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'Event ID' })
  @IsUUID()
  eventId!: string;

  @ApiProperty({ description: 'Number of tickets', default: 1 })
  @IsNumber()
  @IsPositive()
  quantity: number = 1;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
