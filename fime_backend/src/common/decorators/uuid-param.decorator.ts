import { ValidateUuidPipe } from '@/common/pipes/validate-uuid.pipe';
import { Param } from '@nestjs/common';

export const UuidParam = (paramName = 'id') =>
  Param(paramName, ValidateUuidPipe);
