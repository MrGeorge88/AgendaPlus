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
      : [
          'https://agendaplus-frontend.vercel.app',
          'https://agendaplus-git-main-mrgeorge88.vercel.app',
          'https://agendaplus.vercel.app',
          'https://agenda-plus-frontend.vercel.app',
          'https://agenda-plus-frontend-mrgeorge88.vercel.app'
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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