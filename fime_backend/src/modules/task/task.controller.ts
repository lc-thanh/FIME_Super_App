import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { UuidParam } from '@/common/decorators/uuid-param.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import { User } from '@/common/decorators/user.decorator';
import { MoveCardDto } from '@/modules/task/dto/move-card.dto';
import { TaskPriority, TaskType } from '@prisma/client';
import { TodoListDto } from '@/modules/task/dto/todo-list.dto';
import { JsonObject } from '@prisma/client/runtime/library';
import { TaskActivityFilterType } from '@/modules/task/dto/task-activities-pagination';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body('workspaceId') workspaceId: string,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Tạo task mới thành công',
      data: await this.taskService.create(workspaceId, user.sub),
    };
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

  @Get('all-selectable-assignees/:taskId')
  async getAllSelectableAssignees(@UuidParam('taskId') taskId: string) {
    return {
      message: 'Lấy danh sách thành viên có thể thêm vào task thành công',
      data: await this.taskService.getAllSelectableAssignees(taskId),
    };
  }

  @Post('move-card')
  moveCard(
    @Body() moveCardDto: MoveCardDto,
    @User() user: IAccessTokenPayload,
  ) {
    return this.taskService.moveCard(moveCardDto, user.sub);
  }

  @Post('change-title')
  async changeTitle(
    @Body('taskId') taskId: string,
    @Body('title') title: string,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Thay đổi tiêu đề thành công',
      data: await this.taskService.changeTitle(taskId, title, user.sub),
    };
  }

  @Post('add-assignee')
  async addAssignee(
    @Body('taskId') taskId: string,
    @Body('assigneeId') assigneeId: string,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Thêm thành viên vào task thành công',
      data: await this.taskService.addAssignee(taskId, assigneeId, user.sub),
    };
  }

  @Post('remove-assignee')
  async removeAssignee(
    @Body('taskId') taskId: string,
    @Body('assigneeId') assigneeId: string,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Xóa thành viên khỏi task thành công',
      data: await this.taskService.removeAssignee(taskId, assigneeId, user.sub),
    };
  }

  @Post('change-priority')
  async changePriority(
    @Body('taskId') taskId: string,
    @Body('priority') priority: TaskPriority,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Thay đổi mức độ ưu tiên thành công',
      data: await this.taskService.changePriority(taskId, priority, user.sub),
    };
  }

  @Post('change-type')
  async changeType(
    @Body('taskId') taskId: string,
    @Body('type') type: TaskType,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Thay đổi loại công việc thành công',
      data: await this.taskService.changeType(taskId, type, user.sub),
    };
  }

  @Post('change-date')
  async changeDate(
    @Body('taskId') taskId: string,
    @Body('startDate') startDate: Date | null,
    @Body('deadline') deadline: Date | null,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Thay đổi thời gian thành công',
      data: await this.taskService.changeDate(
        taskId,
        startDate,
        deadline,
        user.sub,
      ),
    };
  }

  @Post('sync-todo-list')
  changeTodo(
    @Body('taskId') taskId: string,
    @Body('todos') todos: TodoListDto[],
    @User() user: IAccessTokenPayload,
  ) {
    return this.taskService.syncTodos(taskId, todos, user.sub);
  }

  @Post('sync-note')
  async syncNote(
    @Body('taskId') taskId: string,
    @Body('note') note: JsonObject,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Cập nhật ghi chú thành công',
      data: await this.taskService.syncNote(taskId, note, user.sub),
    };
  }

  @Delete('soft-delete/:taskId')
  async softDeleteTask(
    @UuidParam('taskId') taskId: string,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Xóa task thành công',
      data: await this.taskService.softDeleteTask(taskId, user.sub),
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

  @Get('task-activities/:id')
  getTaskActivities(
    @Query() params: TaskActivityFilterType,
    @UuidParam('id') id: string,
  ) {
    return this.taskService.getTaskActivities(params, id);
  }

  @Get('task-attachments/:taskId')
  getTaskAttachments(@UuidParam('taskId') taskId: string) {
    return this.taskService.getTaskAttachments(taskId);
  }

  @Post('task-attachments/:taskId')
  async addTaskAttachment(
    @UuidParam('taskId') taskId: string,
    @Body('title') title: string,
    @Body('url') url: string,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Thêm đính kèm thành công',
      data: await this.taskService.addTaskAttachment(
        taskId,
        title,
        url,
        user.sub,
      ),
    };
  }

  @Delete('task-attachments/:taskId/:attachmentId')
  async deleteTaskAttachment(
    @UuidParam('taskId') taskId: string,
    @UuidParam('attachmentId') attachmentId: string,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Xóa đính kèm thành công',
      data: await this.taskService.deleteTaskAttachment(
        taskId,
        attachmentId,
        user.sub,
      ),
    };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.taskService.update(+id, updateTaskDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
