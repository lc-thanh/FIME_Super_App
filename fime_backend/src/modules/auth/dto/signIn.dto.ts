import { IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: 'Email/Số điện thoại không được để trống!' })
  username: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' })
  @MaxLength(20, { message: 'Mật khẩu không được quá 20 ký tự!' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  password: string;

  @IsUUID('4', { message: 'deviceId không hợp lệ!' })
  @IsNotEmpty({ message: 'deviceId không được để trống!' })
  deviceId: string;
}
