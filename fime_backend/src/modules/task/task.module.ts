import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from '@/prisma.service';
import { TaskBoardGateway } from '@/gateways/task-board/task-board.gateway';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, TaskBoardGateway],
})
export class TaskModule {}
