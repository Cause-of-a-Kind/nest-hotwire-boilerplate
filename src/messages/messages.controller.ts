import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { MessagesService } from './messages.service';
import { AppService } from '../app.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly appService: AppService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @Render('turbo-frames/messages')
  async getMessages() {
    return {
      messages: await this.messagesService.messages({}),
    };
  }

  @Get('count')
  @Render('turbo-frames/messages-count')
  async getMessagesCount() {
    return {
      messagesCount: await this.messagesService.messagesCount(),
    };
  }

  @Get(':id/edit')
  @Render('turbo-frames/edit-message')
  async editMessage(@Param('id') id: string) {
    return {
      message: await this.messagesService.message({ id: +id }),
    };
  }

  @Post('create')
  @Render('turbo-frames/create-message')
  async createNewMessage(@Body('text') text: string, @Req() req: Request) {
    const newMessage = await this.messagesService.createMessage({
      text,
    });

    const [[, lastMessage], messagesCount] = await Promise.all([
      await this.messagesService.messages({
        orderBy: { id: 'desc' },
        take: 2,
      }),
      await this.messagesService.messagesCount(),
    ]);

    this.appService.sendTurboStreamEvent(req, {
      eventName: 'turbo-stream.event',
      template: 'turbo-streams/create-message',
      broadcastTo: 'all',
      data: {
        previousMessageId: lastMessage.id,
        message: newMessage,
        messagesCount,
      },
    });

    return {
      message: newMessage,
    };
  }

  @Post(':id/edit')
  @Render('turbo-frames/view-message')
  async updateMessage(
    @Param('id') id: string,
    @Body('text') text: string,
    @Req() req: Request,
  ) {
    const newMessage = await this.messagesService.updateMessage({
      where: { id: +id },
      data: { text },
    });

    this.appService.sendTurboStreamEvent(req, {
      eventName: 'turbo-stream.event',
      template: 'turbo-streams/update-message',
      broadcastTo: 'all',
      data: { message: newMessage },
    });

    return {
      message: newMessage,
    };
  }

  @Delete(':id/delete')
  @Render('turbo-frames/delete-message')
  async delete(@Param('id') id: string, @Req() req: Request) {
    const removedMessage = await this.messagesService.deleteMessage({
      id: +id,
    });

    const messagesCount = await this.messagesService.messagesCount();

    this.appService.sendTurboStreamEvent(req, {
      eventName: 'turbo-stream.event',
      template: 'turbo-streams/delete-message',
      broadcastTo: 'all',
      data: { message: removedMessage, messagesCount },
    });

    return {
      message: removedMessage,
    };
  }
}
