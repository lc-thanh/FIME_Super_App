import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @MinLength(6, { message: 'Mật khẩu cũ phải có ít nhất 6 ký tự!' })
  @MaxLength(20, { message: 'Mật khẩu cũ không được quá 20 ký tự!' })
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống!' })
  oldPassword: string;

  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' })
  @MaxLength(20, { message: 'Mật khẩu mới không được quá 20 ký tự!' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống!' })
  newPassword: string;
}
