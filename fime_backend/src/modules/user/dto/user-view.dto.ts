import { Role, UserStatus } from '@prisma/client';

export class UserViewDto {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string | null;
  image: string | null;
  positionName: string | null;
  teamName: string | null;
  genName: string | null;
  role: Role[];
  status: UserStatus;

  createdAt: Date;
  updatedAt: Date;
}
