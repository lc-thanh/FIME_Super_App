import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RefreshsTokenDto {
  @IsString({ message: 'refresh_token phải là chuỗi!' })
  @IsNotEmpty({ message: 'refresh_token không được để trống!' })
  refresh_token: string;

  @IsUUID('all', { message: 'deviceId không hợp lệ!' })
  @IsNotEmpty({ message: 'deviceId không được để trống!' })
  deviceId: string;
}
