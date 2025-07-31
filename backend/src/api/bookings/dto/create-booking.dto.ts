import { IsUUID, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginatorDto } from 'src/utils/paginator';
import { BookingStatus } from 'src/common/enums/booking-status.enum';

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

export class FindBookingDto extends PartialType(PaginatorDto) {
  @ApiPropertyOptional({ description: 'User ID' })
  user_id?: string;

  @ApiPropertyOptional({ description: 'Event ID' })
  event_id?: string;

  @ApiPropertyOptional({ description: 'get active, cancelled and revenue' })
  show_stats?: boolean;

  @ApiPropertyOptional({
    description: `status: ${Object.values(BookingStatus).join(', ')}`,
  })
  status?: BookingStatus;

  @ApiPropertyOptional({ description: 'search' })
  q?: string;
}
