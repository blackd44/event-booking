import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import morgan from 'morgan';
import { NextFunction, Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));

  // Enable CORS
  app.enableCors();

  // Custom logging
  app.use((req: Request, _: any, next: NextFunction) => {
    req.id = uuidv4();
    next();
  });
  morgan.token('id', (req: Request) => req?.id);
  const customFormat = `:method :url :status :res[content-length] - :response-time ms - :id`;
  app.use(morgan(customFormat));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Event Booking Platform API')
    .setDescription('A comprehensive event booking platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
    );
  });
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
