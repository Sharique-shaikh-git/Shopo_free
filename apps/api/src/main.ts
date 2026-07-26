import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors(); // Required for cross-origin requests from frontend

  // Standard REST API prefix
  app.setGlobalPrefix('v1');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`API is running on: http://localhost:${port}/v1`);
}
bootstrap();
