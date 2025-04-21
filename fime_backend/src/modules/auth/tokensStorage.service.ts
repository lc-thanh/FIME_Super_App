import { jwtConstants } from '@/modules/auth/constants';
import {
  BadRequestException,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import Redis from 'ioredis';

@Injectable()
export class TokensStorageService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(private readonly configService: ConfigService) {}

  private redisClient: Redis;

  onApplicationBootstrap() {
    this.redisClient = new Redis(
      this.configService.get<string>('UPSTASH_REDIS_URL') || '',
    );
  }

  onApplicationShutdown(): Promise<'OK'> {
    return this.redisClient.quit();
  }

  async insert({
    userId,
    tokenId,
    keyPrefix,
  }: {
    userId: User['id'];
    tokenId: string;
    keyPrefix?: string;
  }): Promise<void> {
    const key = this.getKey(userId, keyPrefix);
    const expiresIn = jwtConstants.REFRESH_TOKEN_EXPIRES_IN;

    await this.redisClient.set(key, tokenId, 'EX', expiresIn);
  }

  /**
   *
   * @param userId - ID của người dùng
   * @param tokenId - ID của refresh_token
   * @param keyPrefix - Tiền tố của khóa (nếu có)
   * @description Hàm lấy keyPrefix và userId ghép lại thành 1 chuỗi khóa, rồi tìm kiếm trong Redis
   * @returns true nếu tìm thấy khóa (key) có giá trị (value) là storedTokenId và khớp với giá trị tokenId đã cho, false nếu không tìm thấy hoặc giá trị không khớp
   */
  async validate({
    userId,
    tokenId,
    keyPrefix,
  }: {
    userId: User['id'];
    tokenId: string;
    keyPrefix?: string;
  }): Promise<boolean> {
    const key = this.getKey(userId, keyPrefix);
    const storedTokenId = await this.redisClient.get(key);
    const isTokenValid = tokenId === storedTokenId;

    if (!isTokenValid) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn!');
    }

    return true;
  }

  async invalidateUserKeys(userId: User['id']): Promise<number> {
    const pattern = `*${this.getKey(userId)}*`;
    const keys = await this.redisClient.keys(pattern);

    if (keys.length === 0) return 0;

    const res = await this.redisClient.del(keys);

    return res;
  }

  async invalidateOneUserKey({
    userId,
    keyPrefix,
  }: {
    userId: User['id'];
    keyPrefix?: string;
  }): Promise<number> {
    const key = this.getKey(userId, keyPrefix);

    const res = await this.redisClient.del(key);
    return res;
  }

  private getKey(userId: User['id'], prefix = ''): string {
    return `${prefix}_user-${userId}`;
  }
}
