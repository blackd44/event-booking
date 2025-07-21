import { Injectable } from '@nestjs/common';
import { CreateUserDto, FindUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { errorMessage } from 'src/utils/error';
import { PaginatorResponse, Paginators } from 'src/utils/paginator';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly bookingsService: BookingsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      const data = await this.userRepository.save(user);
      return { data };
    } catch (error: unknown) {
      return { error: errorMessage(error) };
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new Error('User not found');

      return { data: user };
    } catch (error) {
      return { error: errorMessage(error) };
    }
  }

  async findAll(body: FindUserDto) {
    try {
      const { q, show_bookings } = body;
      const { skip, limit, sorts } = Paginators(body);

      const [data, count] = await this.userRepository.findAndCount({
        where: q
          ? [
              { email: ILike(`%${q}%`) },
              { firstName: ILike(`%${q}%`) },
              { lastName: ILike(`%${q}%`) },
            ]
          : {},
        order: sorts,
        skip: skip,
        take: limit,
      });

      if ([true, 'true']?.includes(show_bookings || ''))
        for (const user of data) {
          const { data: res } = await this.bookingsService.findAll({
            user_id: user.id,
            size: 0,
          });
          user.bookingsCount = res?.total || 0;
        }

      return { data: PaginatorResponse(data, count, limit, skip) };
    } catch (error: unknown) {
      return { error: errorMessage(error) };
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
