import { IsNotEmpty } from 'class-validator';

export class SignOutDto {
  @IsNotEmpty({ message: 'refresh_token không được để trống!' })
  refresh_token: string;
}
