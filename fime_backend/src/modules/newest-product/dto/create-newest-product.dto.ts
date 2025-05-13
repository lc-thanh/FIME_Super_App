import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateNewestProductDto {
  @MaxLength(100, { message: 'Tiêu đề quá dài!' })
  @MinLength(1, { message: 'Tiêu đề không được để trống!' })
  title: string;

  @IsOptional()
  @IsDate({ message: 'Ngày không hợp lệ!' })
  @Transform(({ value }): any => {
    // Nếu là string, parse lại thành Date
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  date: Date;

  @IsOptional()
  @MaxLength(999, { message: 'Note quá dài!' })
  note?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Link không được để trống!' })
  @IsString({ message: 'Link không hợp lệ!' })
  link?: string;
}
