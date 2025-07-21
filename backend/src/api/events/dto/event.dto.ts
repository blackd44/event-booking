import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { PaginatorDto } from 'src/utils/paginator';

export class CreateEventDto {
  @ApiProperty({ description: 'Event title' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Event description' })
  @IsString()
  description!: string;

  @ApiProperty({ description: 'Event location' })
  @IsString()
  location!: string;

  @ApiProperty({ description: 'Event date and time' })
  @IsDate()
  @Type(() => Date)
  date!: Date;

  @ApiProperty({ description: 'Maximum capacity' })
  @IsNumber()
  @IsPositive()
  capacity!: number;

  @ApiProperty({ description: 'Ticket price' })
  @IsNumber()
  @Min(0)
  price!: number;
}
export class UpdateEventDto extends PartialType(CreateEventDto) {}

export class FindEventsDto extends PartialType(PaginatorDto) {
  @ApiProperty({ required: false })
  min_date?: string;

  @ApiProperty({ required: false })
  max_date?: string;

  @ApiProperty({ required: false })
  q?: string;
}
