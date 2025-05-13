export class NewestProductViewDto {
  id: string;
  title: string;
  date: Date | null;
  note: string | null;
  image: string | null;
  link: string | null;

  createdAt: Date;
  updatedAt: Date;
}
