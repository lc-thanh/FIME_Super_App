import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống!' })
  @MinLength(3, { message: 'Họ tên phải có ít nhất 3 ký tự!' })
  @MaxLength(50, { message: 'Họ tên không được quá 50 ký tự!' })
  fullname: string;

  @IsNotEmpty({ message: 'Email không được để trống!' })
  @IsEmail({}, { message: 'Email không hợp lệ!' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' })
  @MaxLength(20, { message: 'Mật khẩu không được quá 20 ký tự!' })
  password: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống!' })
  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, {
    message: 'Số điện thoại không hợp lệ!',
  })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ không hợp lệ!' })
  address: string;

  @IsOptional()
  @IsString({ message: 'Hình ảnh không hợp lệ!' })
  image: string;

  @IsOptional()
  @IsEnum(Role, { each: true, message: 'Vai trò không hợp lệ!' })
  role: Role[];
}
