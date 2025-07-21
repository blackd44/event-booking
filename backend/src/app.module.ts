import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule, ApiRoutes } from './api/api.module';
import configuration from './config/configuration';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT!) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'event_booking',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // synchronize: process.env.NODE_ENV !== 'production',
      synchronize: true,
    }),
    ApiModule,
    RouterModule.register([...ApiRoutes]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
