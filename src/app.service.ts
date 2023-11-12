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
      broadcastTo = 'self',
      predicate,
    }: {
      eventName: string;
      template: string;
      data: object;
      broadcastTo?: 'self' | 'all' | 'with-permissions';
      predicate?: (req: Request) => Promise<boolean>;
    },
  ) {
    req.app.render(template, data, (_err, html) => {
      this.eventEmitter.emit(eventName, {
        template: html,
        broadcastTo,
        predicate,
        requestStreamId: req.cookies['x-turbo-stream-id'],
      });
    });
  }
}
