import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { AppService } from '../app.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [MessagesController],
  providers: [AppService, PrismaService, MessagesService],
})
export class MessagesModule {}
