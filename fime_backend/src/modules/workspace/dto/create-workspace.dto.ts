import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsNotEmpty({ message: 'Tên workspace không được để trống' })
  @IsString({ message: 'Tên workspace không hợp lệ' })
  name: string;
}
