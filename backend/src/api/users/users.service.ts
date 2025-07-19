import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { errorMessage } from 'src/utils/error';
import {
  PaginatorDto,
  PaginatorResponse,
  Paginators,
} from 'src/utils/paginator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  async findAll(body: PaginatorDto) {
    try {
      const { skip, limit, sorts } = Paginators(body);

      const [data, count] = await this.userRepository.findAndCount({
        order: sorts,
        skip: skip,
        take: limit,
      });

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
