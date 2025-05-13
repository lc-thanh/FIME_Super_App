import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLatestPublicationDto {
  @MaxLength(100, { message: 'Tiêu đề quá dài!' })
  @MinLength(1, { message: 'Tiêu đề không được để trống!' })
  title: string;

  @IsOptional()
  @MaxLength(999, { message: 'Note quá dài!' })
  note?: string;

  @IsNotEmpty({ message: 'Mã nhúng không được để trống!' })
  @IsString({ message: 'Mã nhúng không hợp lệ!' })
  embed_code: string;
}
