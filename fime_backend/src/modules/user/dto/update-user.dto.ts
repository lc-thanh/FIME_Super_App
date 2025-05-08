import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(
//   OmitType(CreateUserDto, ['password'] as const),
// ) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
