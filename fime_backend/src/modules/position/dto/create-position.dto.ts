import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreatePositionDto {
  @MaxLength(50, { message: 'Tên chức vụ quá dài!' })
  @MinLength(1, { message: 'Tên chức vụ không được để trống!' })
  name: string;

  @IsOptional()
  @MaxLength(999, { message: 'Mô tả quá dài!' })
  description?: string;
}
