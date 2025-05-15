import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UuidParam } from '@/common/decorators/uuid-param.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import { User } from '@/common/decorators/user.decorator';
import { MoveCardDto } from '@/modules/task/dto/move-card.dto';
import { TaskPriority, TaskType } from '@prisma/client';
import { TodoListDto } from '@/modules/task/dto/todo-list.dto';
import { JsonObject } from '@prisma/client/runtime/library';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get('my-task-cards/:workspaceId')
  async getPersonalTasks(
    @UuidParam('workspaceId') workspaceId: string,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Lấy danh sách task cá nhân thành công!',
      data: {
        columns: await this.taskService.getTaskCards(user.sub, workspaceId),
      },
    };
  }

  @Post('move-card')
  moveCard(@Body() moveCardDto: MoveCardDto) {
    return this.taskService.moveCard(moveCardDto);
  }

  @Post('add-assignee')
  async addAssignee(
    @Body('taskId') taskId: string,
    @Body('assigneeId') assigneeId: string,
  ) {
    return {
      message: 'Thêm thành viên vào task thành công',
      data: await this.taskService.addAssignee(taskId, assigneeId),
    };
  }

  @Post('remove-assignee')
  async removeAssignee(
    @Body('taskId') taskId: string,
    @Body('assigneeId') assigneeId: string,
  ) {
    return {
      message: 'Xóa thành viên khỏi task thành công',
      data: await this.taskService.removeAssignee(taskId, assigneeId),
    };
  }

  @Post('change-priority')
  async changePriority(
    @Body('taskId') taskId: string,
    @Body('priority') priority: TaskPriority,
  ) {
    return {
      message: 'Thay đổi mức độ ưu tiên thành công',
      data: await this.taskService.changePriority(taskId, priority),
    };
  }

  @Post('change-type')
  async changeType(
    @Body('taskId') taskId: string,
    @Body('type') type: TaskType,
  ) {
    return {
      message: 'Thay đổi loại công việc thành công',
      data: await this.taskService.changeType(taskId, type),
    };
  }

  @Post('change-date')
  async changeDate(
    @Body('taskId') taskId: string,
    @Body('startDate') startDate: Date,
    @Body('deadline') deadline: Date,
  ) {
    return {
      message: 'Thay đổi thời gian thành công',
      data: await this.taskService.changeDate(taskId, startDate, deadline),
    };
  }

  @Post('sync-todo-list')
  changeTodo(
    @Body('taskId') taskId: string,
    @Body('todos') todos: TodoListDto[],
  ) {
    return this.taskService.syncTodos(taskId, todos);
  }

  @Post('sync-note')
  async syncNote(
    @Body('taskId') taskId: string,
    @Body('note') note: JsonObject,
  ) {
    return {
      message: 'Cập nhật ghi chú thành công',
      data: await this.taskService.syncNote(taskId, note),
    };
  }

  @Delete('soft-delete/:taskId')
  async softDeleteTask(@UuidParam('taskId') taskId: string) {
    return {
      message: 'Xóa task thành công',
      data: await this.taskService.softDeleteTask(taskId),
    };
  }

  @Get('schedule')
  async getSchedule(@User() user: IAccessTokenPayload) {
    return {
      message: 'Lấy lịch làm việc thành công',
      data: await this.taskService.getSchedule(user.sub),
    };
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@UuidParam('id') id: string) {
    return {
      message: 'Lấy thông tin task thành công',
      data: await this.taskService.findOne(id, ['id']),
    };
  }

  @Get('task-details/:id')
  async getTaskDetails(@UuidParam('id') id: string) {
    return {
      message: 'Lấy thông tin chi tiết task thành công',
      data: await this.taskService.findOneWithDetails(id, ['id']),
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
