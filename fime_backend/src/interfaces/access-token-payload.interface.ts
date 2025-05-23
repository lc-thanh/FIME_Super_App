import { Role } from '@prisma/client';

export interface IAccessTokenPayload {
  sub: string;
  email: string;
  role: Role[];
  deviceId: string;
}
