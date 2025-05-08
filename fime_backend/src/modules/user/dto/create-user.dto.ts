import { BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @MaxLength(50, { message: 'Họ tên không được quá 50 ký tự!' })
  @MinLength(3, { message: 'Họ tên phải có ít nhất 3 ký tự!' })
  @IsNotEmpty({ message: 'Họ tên không được để trống!' })
  fullname: string;

  @IsEmail({}, { message: 'Email không hợp lệ!' })
  @IsNotEmpty({ message: 'Email không được để trống!' })
  email: string;

  // @MaxLength(20, { message: 'Mật khẩu không được quá 20 ký tự!' })
  // @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' })
  // @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  // password: string;

  @Matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, {
    message: 'Số điện thoại không hợp lệ!',
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống!' })
  phone: string;

  @IsOptional()
  @MaxLength(256, { message: 'Địa chỉ quá dài!' })
  @IsString({ message: 'Địa chỉ không hợp lệ!' })
  address: string;

  @IsOptional()
  @IsString({ message: 'Hình ảnh không hợp lệ!' })
  image: string;

  @IsOptional()
  @IsUUID('4', { message: 'Chức vụ không hợp lệ!' })
  positionId: string;

  @IsOptional()
  @IsUUID('4', { message: 'Ban không hợp lệ!' })
  teamId: string;

  @IsOptional()
  @IsEnum(Role, { each: true, message: 'Vai trò không hợp lệ!' })
  @Transform(({ value }): any => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as Role[]; // Chuyển JSON string thành mảng thực sự
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new BadRequestException('Vai trò không hợp lệ!');
      }
    }
    return value;
  })
  role: Role[];

  @IsOptional()
  @IsUUID('4', { message: 'Gen không hợp lệ!' })
  genId: string;
}
