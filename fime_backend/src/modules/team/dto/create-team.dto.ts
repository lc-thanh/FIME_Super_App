import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateTeamDto {
  @MaxLength(50, { message: 'Tên ban quá dài!' })
  @MinLength(3, { message: 'Tên ban quá ngắn!' })
  @IsNotEmpty({ message: 'Tên ban không được để trống!' })
  name: string;

  @IsOptional()
  @MaxLength(999, { message: 'Mô tả quá dài!' })
  description?: string;
}
