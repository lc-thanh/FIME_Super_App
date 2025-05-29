import { UserViewDto } from '@/modules/user/dto/user-view.dto';
import { TaskPriority, TaskStatus, TaskType } from '@prisma/client';

export class TaskCardDto {
  id: string;
  title: string;
  position: number;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: Date | null;
  deadline: Date | null;
  type: TaskType;
  users: Pick<
    UserViewDto,
    'id' | 'email' | 'fullname' | 'image' | 'positionName' | 'teamName'
  >[];
}

export class TaskColumnDto {
  id: TaskStatus;
  title: string;
  cards: TaskCardDto[];
}
