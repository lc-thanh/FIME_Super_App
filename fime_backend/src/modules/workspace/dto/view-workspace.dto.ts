import { User } from '@prisma/client';

export class ViewWorkspaceDto {
  id: string;
  name: string;
  users: Pick<User, 'id' | 'fullname' | 'image'>[];

  createdAt: Date;
  updatedAt: Date;
}
