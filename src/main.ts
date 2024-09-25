import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //const configService = app.get(ConfigService);
  //const PORT = configService.get<number>('port');
  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  await app.listen(process.env.PORT || 3000);
  console.log(`App running on port: ${process.env.PORT || 3000}`)
}
bootstrap();
