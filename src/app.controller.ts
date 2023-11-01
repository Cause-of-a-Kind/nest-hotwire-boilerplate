import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Req,
  Sse,
} from '@nestjs/common';
import { Request } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppService } from './app.service';
import { Observable, fromEvent, map } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private eventEmitter: EventEmitter2,
  ) {}

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

  @Get('/messages')
  @Render('turbo-frames/messages')
  getMessages() {
    return {
      messages: this.appService.getMessages(),
    };
  }

  @Get('/messages/:id/edit')
  @Render('turbo-frames/edit-message')
  editMessage(@Param('id') id: string) {
    return {
      message: this.appService.findMessage(+id),
    };
  }

  @Post('/messages/:id/edit')
  @Render('turbo-frames/view-message')
  updateMessage(
    @Param('id') id: string,
    @Body('text') text: string,
    @Req() req: Request,
  ) {
    const newMessage = this.appService.editMessage(+id, text);

    this.appService.sendTurboStreamEvent(req, {
      template: 'turbo-streams/update-message',
      data: { message: newMessage },
    });

    return {
      message: newMessage,
    };
  }

  @Sse('/turbo-streams')
  async sse(): Promise<Observable<MessageEvent>> {
    return fromEvent(this.eventEmitter, 'turbo-stream.event').pipe(
      map((payload: { template: string }) => {
        return {
          data: payload.template,
        } as MessageEvent;
      }),
    );
  }
}
