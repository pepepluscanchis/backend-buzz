import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir peticiones desde Flutter
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Aquí está la magia: agregamos '0.0.0.0' para abrir la red al emulador
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();