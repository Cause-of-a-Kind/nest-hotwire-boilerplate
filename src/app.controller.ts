import { Controller, Get, Render, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

@Controller()
export class AppController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Get()
  @Render('index')
  root() {
    return {
      title: 'Home Page',
    };
  }

  @Get('/about')
  @Render('index')
  getAbout() {
    return {
      title: 'About Page',
    };
  }

  @Sse('turbo-stream/events')
  async streamEvent(): Promise<Observable<MessageEvent>> {
    return fromEvent(this.eventEmitter, 'turbo-stream.event').pipe(
      map((payload: { template: string }) => {
        return {
          data: payload.template,
        } as MessageEvent;
      }),
    );
  }
}
