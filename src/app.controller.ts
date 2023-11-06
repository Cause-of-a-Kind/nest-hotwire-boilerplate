import { Controller, Get, Render } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class AppController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Get()
  @Render('index')
  root() {
    return {
      title: 'Home Page - Hello world MVC!',
    };
  }

  @Get('/about')
  @Render('index')
  getAbout() {
    return {
      title: 'About Page - Hello world MVC!',
    };
  }
}
