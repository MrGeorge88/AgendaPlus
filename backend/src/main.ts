import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isDev = process.env.NODE_ENV === 'development';

  // Configuración de CORS
  app.enableCors({
    origin: isDev
      ? ['http://localhost:5173', 'http://localhost:4173']
      : ['https://agenda-plus.vercel.app'],
    credentials: true,
  });

  // Configuración de validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Configuración de Swagger (solo en desarrollo)
  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('AgendaPlus API')
      .setDescription('API para la gestión de citas y servicios')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Puerto de la aplicación
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Aplicación corriendo en: http://localhost:${port}`);
}

bootstrap();