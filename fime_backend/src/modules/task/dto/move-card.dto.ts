import { TaskStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class MoveCardDto {
  @IsUUID('4', { message: 'workspaceId không hợp lệ!' })
  @IsNotEmpty({ message: 'workspaceId không được để trống!' })
  workspaceId: string;

  @IsUUID('4', { message: 'cardId không hợp lệ!' })
  @IsNotEmpty({ message: 'cardId không được để trống!' })
  cardId: string;

  @IsUUID('4', { message: 'cardBeforeId không hợp lệ!' })
  @IsOptional()
  cardBeforeId: string | null;

  @IsUUID('4', { message: 'cardAfterId không hợp lệ!' })
  @IsOptional()
  cardAfterId: string | null;

  @IsEnum(TaskStatus, { message: 'column không hợp lệ!' })
  @IsNotEmpty({ message: 'column không được để trống!' })
  column: TaskStatus;

  @IsString()
  @IsOptional()
  socketId?: string;
}
