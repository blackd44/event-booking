import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [UsersModule, AuthModule, EventsModule],
})
export class ApiModule {}
