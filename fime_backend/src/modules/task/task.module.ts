import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from '@/prisma.service';
import { TaskBoardGateway } from '@/gateways/task-board/task-board.gateway';
import { UserService } from '@/modules/user/user.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, TaskBoardGateway, UserService],
})
export class TaskModule {}
