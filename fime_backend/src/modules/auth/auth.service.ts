import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { comparePasswordHelper } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { SignUpDto } from '@/modules/auth/dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username, ['email', 'phone']);
    if (!user) return null;

    const isPasswordValid = await comparePasswordHelper(
      password,
      user.password,
    );
    if (!isPasswordValid) return null;

    return user;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      message: 'Đăng nhập thành công!',
      data: {
        access_token: await this.jwtService.signAsync(payload),
      },
    };
  }

  async register(body: SignUpDto) {
    return this.usersService.handleRegister(body);
  }
}
