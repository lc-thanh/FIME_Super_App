import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

// export class UpdateUserDto extends PartialType(
//   OmitType(CreateUserDto, ['password'] as const),
// ) {}

export class UpdateUserDto extends CreateUserDto {
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  isImageChanged: boolean;
}
