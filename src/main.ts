import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { BadRequestFilter } from './helpers/exceptions/bad-request.exception';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new BadRequestFilter());

  // Create Swagger options
  const options = new DocumentBuilder()
    .setTitle('API Products and Pokemon')
    .setDescription('Nest JS for SALT Technical Test')
    .setVersion('1.0')
    .addTag('Products') // Add tags for controllers
    .addTag('Pokemon') // Add tags for controllers
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, options);

  try {
    // Save the Swagger document as JSON
    const swaggerSpec = JSON.stringify(document, null, 2);
    fs.writeFileSync('./api-docs.json', swaggerSpec);
  } catch (error) {
    console.error('Error writing Swagger JSON:', error);
  }
  
  // Serve Swagger UI at /api/docs
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
