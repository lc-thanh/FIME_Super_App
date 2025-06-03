import { Role, UserStatus } from '@prisma/client';

export class UserDetailsDto {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string | null;
  birthday: Date | null;
  image: string | null;

  positionId: string | null;
  positionName: string | null;
  teamId: string | null;
  teamName: string | null;
  genId: string | null;
  genName: string | null;

  role: Role[];
  status: UserStatus;

  taskCount: number;
  todoListCount: number;
  taskAttachmentCount: number;

  createdAt: Date;
  updatedAt: Date;
}
