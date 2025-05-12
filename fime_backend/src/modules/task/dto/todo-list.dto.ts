export class TodoListDto {
  id: string;
  order: number;
  content: string;
  isDone: boolean;
  startDate: Date | null;
  deadline: Date | null;
  userIds: string[];
}
