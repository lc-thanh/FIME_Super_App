import { SetMetadata } from '@nestjs/common';

export const CUSTOM_FORBIDDEN_MESSAGE = 'customForbiddenMessage';
export const CustomForbiddenMessage = (message: string) =>
  SetMetadata(CUSTOM_FORBIDDEN_MESSAGE, message);
