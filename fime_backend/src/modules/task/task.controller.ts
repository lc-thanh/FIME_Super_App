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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
