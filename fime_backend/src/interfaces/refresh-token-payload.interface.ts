import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';

export interface IRefreshTokenPayload extends IAccessTokenPayload {
  refreshTokenId: string;
}
