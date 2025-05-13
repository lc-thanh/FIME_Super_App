export class PublicationViewDto {
  id: string;
  title: string;
  note: string | null;
  embed_code: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
