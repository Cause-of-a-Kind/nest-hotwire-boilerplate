import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(private eventEmitter: EventEmitter2) {}

  getHello(): string {
    return 'Hello World!';
  }

  sendTurboStreamEvent(
    req: Request,
    {
      eventName,
      template,
      data,
    }: {
      eventName: string;
      template: string;
      data: object;
    },
  ) {
    req.app.render(template, data, (_err, html) => {
      this.eventEmitter.emit(eventName, {
        template: html,
      });
    });
  }
}
