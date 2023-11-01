import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';

@Injectable()
export class AppService {
  messages = [
    { text: 'Message 1', id: 1 },
    { text: 'Message 2', id: 2 },
    { text: 'Message 3', id: 3 },
    { text: 'Message 4', id: 4 },
    { text: 'Message 5', id: 5 },
    { text: 'Message 6', id: 6 },
  ];

  constructor(private eventEmitter: EventEmitter2) {}

  getHello(): string {
    return 'Hello World!';
  }

  getMessages(): { id: number; text: string }[] {
    return this.messages;
  }

  findMessage(id: number): { id: number; text: string } {
    return this.messages.find((message) => message.id === id);
  }

  editMessage(id: number, text: string): { id: number; text: string } {
    // update messages array
    this.messages = this.messages.map((message) => {
      if (message.id === id) {
        message.text = text;
      }
      return message;
    });

    return this.findMessage(id);
  }

  createMessage(text: string): { id: number; text: string } {
    const id = this.messages.length + 1;
    const message = { id, text };
    this.messages.push(message);
    return message;
  }

  sendTurboStreamEvent(
    req: Request,
    {
      template,
      data,
    }: {
      template: string;
      data: object;
    },
  ) {
    req.app.render(template, data, (_err, html) => {
      this.eventEmitter.emit('turbo-stream.event', {
        template: html,
      });
    });
  }
}
