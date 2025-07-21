import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { PaginatorDto } from 'src/utils/paginator';

export class CreateUserDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  firstName!: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  lastName!: string;

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class FindUserDto extends PartialType(PaginatorDto) {
  @ApiProperty({ description: 'Search', required: false })
  q?: string;

  @ApiProperty({ description: 'can show user bookings', required: false })
  show_bookings?: boolean;
}
