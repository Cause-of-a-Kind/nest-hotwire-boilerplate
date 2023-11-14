import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import hbs = require('hbs');
import hbsUtils = require('hbs-utils');

const hbsUtilsInstance = hbsUtils(hbs);

hbsUtilsInstance.registerPartials(join(__dirname, '..', 'views', 'partials'));
hbsUtilsInstance.registerWatchedPartials(
  join(__dirname, '..', 'views', 'partials'),
);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
