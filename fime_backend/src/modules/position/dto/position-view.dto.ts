export class PositionViewDto {
  id: string;
  name: string;
  description: string | null;
  usersCount: number | null;

  createdAt: Date;
  updatedAt: Date;
}
