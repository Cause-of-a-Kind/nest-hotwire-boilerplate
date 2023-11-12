import { Controller, Get, Render, Req, Res, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import { Request, Response } from 'express';
import { createId } from '@paralleldrive/cuid2';

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
  async streamEvent(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Observable<MessageEvent>> {
    if (!req.cookies['x-turbo-stream-id']) {
      res.cookie('x-turbo-stream-id', createId());
    }

    return fromEvent(this.eventEmitter, 'turbo-stream.event').pipe(
      map(
        (payload: {
          template: string;
          requestStreamId: string;
          broadcastTo: 'self' | 'all' | 'with-permissions';
          predicate?: (req: Request) => Promise<boolean>;
        }) => {
          switch (payload.broadcastTo) {
            case 'all':
              return {
                data: payload.template,
              } as MessageEvent;
            case 'self':
              if (
                !!payload.requestStreamId &&
                !!req.cookies['x-turbo-stream-id'] &&
                payload.requestStreamId === req.cookies['x-turbo-stream-id']
              ) {
                return {
                  data: payload.template,
                } as MessageEvent;
              }

              return;
            case 'with-permissions':
              // TODO: Implement permissions predicate
              return {
                data: payload.template,
              } as MessageEvent;
            default:
              // This should never happen
              return {} as never;
          }
        },
      ),
    );
  }
}
