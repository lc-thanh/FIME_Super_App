import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: 'Email hoặc số điện thoại không được để trống!' })
  @IsString({ message: 'Email hoặc số điện thoại không hợp lệ!' })
  emailOrPhone: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  @IsString({ message: 'Mật khẩu không hợp lệ!' })
  password: string;
}
