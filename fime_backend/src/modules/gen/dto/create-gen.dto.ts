import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateGenDto {
  @MaxLength(50, { message: 'Tên Gen quá dài!' })
  @MinLength(1, { message: 'Tên Gen không được để trống!' })
  name: string;

  @IsOptional()
  @MaxLength(999, { message: 'Mô tả quá dài!' })
  description?: string;
}
