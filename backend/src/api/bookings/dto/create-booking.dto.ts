import { IsUUID, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginatorDto } from 'src/utils/paginator';

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
  @ApiProperty({ description: 'User ID' })
  user_id?: string;
}
