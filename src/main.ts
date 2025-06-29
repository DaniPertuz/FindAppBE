import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { rawBodyMiddleware } from './payments/middleware/raw-body.middleware';

async function bootstrap() {
  const PORT = envs.port;
  const logger = new Logger('FindApp');
  const app = await NestFactory.create(AppModule);

  app.use(rawBodyMiddleware);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(PORT);
  logger.log(`FindApp running on port ${PORT}`);
}
bootstrap();
