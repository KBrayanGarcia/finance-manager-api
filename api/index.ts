import { ValidationPipe, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import { AppModule } from '../src/app.module';

const server: Express = express();
let cachedApp: INestApplication | null = null;

async function bootstrapServer(): Promise<INestApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const prefixGlobal = 'api/v1';

  app.enableCors();
  app.setGlobalPrefix(prefixGlobal);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.init();
  cachedApp = app;
  return app;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  await bootstrapServer();
  server(req, res);
}
