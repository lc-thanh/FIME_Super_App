import { TaskPriority, TaskStatus, User } from '@prisma/client';

export class TaskCardDto {
  id: string;
  title: string;
  position: number;
  status: TaskStatus;
  priority: TaskPriority;
  users: Pick<User, 'id' | 'email' | 'fullname' | 'image'>[];
}

export class TaskColumnDto {
  id: TaskStatus;
  title: string;
  cards: TaskCardDto[];
}
