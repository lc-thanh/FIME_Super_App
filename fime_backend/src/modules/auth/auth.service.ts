import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { comparePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(emailOrPhone: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(emailOrPhone, [
      'email',
      'phone',
    ]);
    if (!user) {
      throw new UnauthorizedException(
        'Email hoặc Số điện thoại không chính xác!',
      );
    }

    const isPasswordValid = await comparePasswordHelper(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không chính xác!');
    }

    const payload = {
      sub: user.id,
      username: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
