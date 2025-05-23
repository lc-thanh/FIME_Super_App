import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from '@/prisma.service';
import { TaskBoardGateway } from '@/gateways/task-board/task-board.gateway';
import { UserService } from '@/modules/user/user.service';
import { AccessControlService } from '@/modules/shared/access-control.service';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    PrismaService,
    TaskBoardGateway,
    UserService,
    AccessControlService,
  ],
})
export class TaskModule {}
