import { Role, UserStatus } from '@prisma/client';

export class UserViewDto {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string | null;
  image: string | null;
  positionId: string | null;
  positionName: string | null;
  teamId: string | null;
  teamName: string | null;
  genId: string | null;
  genName: string | null;
  role: Role[];
  status: UserStatus;

  createdAt: Date;
  updatedAt: Date;
}
