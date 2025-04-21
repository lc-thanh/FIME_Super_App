import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import { IRefreshTokenPayload } from '@/interfaces/refresh-token-payload.interface';
import { jwtConstants } from '@/modules/auth/constants';
import { GeneratedTokensDto } from '@/modules/auth/dto/generated-tokens.dto';
import { RefreshsTokenDto } from '@/modules/auth/dto/refresh-tokens.dto';
import { TokensStorageService } from '@/modules/auth/tokensStorage.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UserService } from '@/modules/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly tokensStorageService: TokensStorageService,
  ) {}

  private getRefreshTokenIdKeyPrefix(deviceId: string): string {
    return `${jwtConstants.REFRESH_TOKEN_ID_STORE_PREFIX}_device-${deviceId}`;
  }

  async generateTokens({
    id: userId,
    email,
    role,
    deviceId,
  }: Pick<User, 'id' | 'email' | 'role'> & {
    deviceId: string;
  }): Promise<GeneratedTokensDto> {
    try {
      const payload: IAccessTokenPayload = {
        sub: userId,
        email,
        role,
        deviceId,
      };

      const refreshTokenId = randomUUID();

      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(payload, {
          expiresIn: jwtConstants.ACCESS_TOKEN_EXPIRES_IN,
        }),
        this.jwtService.signAsync(
          { ...payload, refreshTokenId } as IRefreshTokenPayload,
          {
            secret: this.configService.get<string>(
              'JWT_REFRESH_TOKEN_SECRET_KEY',
            ),
            expiresIn: jwtConstants.REFRESH_TOKEN_EXPIRES_IN,
          },
        ),
      ]);

      await this.tokensStorageService.insert({
        userId,
        tokenId: refreshTokenId,
        keyPrefix: this.getRefreshTokenIdKeyPrefix(deviceId),
      });

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async refreshToken({
    refresh_token,
    deviceId,
  }: RefreshsTokenDto): Promise<GeneratedTokensDto & { expires_at: number }> {
    try {
      const {
        sub,
        refreshTokenId,
        deviceId: tokenDeviceId,
      } = await this.jwtService.verifyAsync<IRefreshTokenPayload>(
        refresh_token,
        {
          secret: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_SECRET_KEY',
          ),
        },
      );

      if (tokenDeviceId !== deviceId) {
        throw new BadRequestException(
          'Token không hợp lệ hoặc deviceId không đúng!',
        );
      }

      const user = await this.userService.findOne(sub, ['id']);
      if (!user) {
        throw new BadRequestException('Token không hợp lệ!');
      }

      const userId = user.id;
      // Hàm kiểm tra tokenId trong database Redis
      await this.tokensStorageService.validate({
        userId,
        keyPrefix: this.getRefreshTokenIdKeyPrefix(deviceId),
        tokenId: refreshTokenId,
      });

      const newTokens = await this.generateTokens({ ...user, deviceId });

      return {
        ...newTokens,
        expires_at: Date.now() + 1000 * jwtConstants.ACCESS_TOKEN_EXPIRES_IN,
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Token không hợp lệ!');
      }

      if (error instanceof BadRequestException)
        throw new BadRequestException(
          error.message ||
            'Token không hợp lệ hoặc đã hết hạn, hoặc deviceId không đúng!',
        );

      throw new InternalServerErrorException(
        'Có lỗi xảy ra trong quá trình làm mới token!',
      );
    }
  }

  async invalidateToken(refresh_token: string) {
    try {
      const { sub, deviceId: tokenDeviceId } =
        await this.jwtService.verifyAsync<IRefreshTokenPayload>(refresh_token, {
          secret: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_SECRET_KEY',
          ),
        });

      const res = await this.tokensStorageService.invalidateOneUserKey({
        userId: sub,
        keyPrefix: this.getRefreshTokenIdKeyPrefix(tokenDeviceId),
      });

      if (res === 0) {
        throw new BadRequestException();
      }

      return {
        message: 'Xóa token thành công!',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn!');
      } else {
        throw new InternalServerErrorException(
          'Có lỗi xảy ra trong quá trình xóa token!',
        );
      }
    }
  }
}
