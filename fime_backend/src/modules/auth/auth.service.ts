import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { comparePasswordHelper } from '@/helpers/util';
import { UserStatus } from '@prisma/client';
import { TokensService } from '@/modules/auth/tokens.service';
import { SignInDto } from '@/modules/auth/dto/signIn.dto';
import { jwtConstants } from '@/modules/auth/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokensService: TokensService,
  ) {}

  async login(body: SignInDto) {
    const { username, password, deviceId } = body;

    const user = await this.usersService.findOne(username, ['email', 'phone']);
    if (!user)
      throw new UnprocessableEntityException([
        {
          field: 'username',
          error: 'Không tồn tại Email hoặc Số điện thoại này!',
        },
      ]);

    const isPasswordValid = await comparePasswordHelper(
      password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Mật khẩu không chính xác!',
        },
      ]);

    if (user.status === UserStatus.BANNED)
      throw new HttpException(
        {
          message:
            'Tài khoản của bạn đã bị khóa, vui lòng liên hệ Admin để mở lại tài khoản!',
          statusCode: HttpStatus.LOCKED,
          error: 'Locked',
        },
        HttpStatus.LOCKED,
      );

    const { access_token, refresh_token } =
      await this.tokensService.generateTokens({
        ...user,
        deviceId,
      });

    return {
      message: 'Đăng nhập thành công!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          image: user.image,
          fullname: user.fullname,
          role: user.role,
        },
        access_token,
        refresh_token,
        expires_at: Date.now() + 1000 * jwtConstants.ACCESS_TOKEN_EXPIRES_IN, // 1 day
      },
    };
  }

  // async register(body: SignUpDto) {
  //   return this.usersService.handleRegister(body);
  // }
}
