import { Body, Controller, Get, Post, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Request as RequestType } from 'express';
import { Public } from '@/common/decorators/public-route.decorator';
import { MailerService } from '@nestjs-modules/mailer';
import { RefreshsTokenDto } from '@/modules/auth/dto/refresh-tokens.dto';
import { TokensService } from '@/modules/auth/tokens.service';
import { SignInDto } from '@/modules/auth/dto/signIn.dto';
import { TokensStorageService } from '@/modules/auth/tokensStorage.service';
import { SignOutDto } from '@/modules/auth/dto/signOut.dto';
import { User } from '@/common/decorators/user.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import { ChangePasswordDto } from '@/modules/auth/dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly mailerService: MailerService,
    private readonly tokensStorageService: TokensStorageService,
  ) {}

  @Post('login')
  @Public()
  handleLogin(@Body() body: SignInDto) {
    return this.authService.login(body);
  }

  @Post('logout')
  @Public()
  async handleLogout(@Body() body: SignOutDto) {
    return this.tokensService.invalidateToken(body.refresh_token);
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(@Body() body: RefreshsTokenDto) {
    const data = await this.tokensService.refreshToken(body);
    return {
      message: 'Làm mới token thành công!',
      data,
    };
  }

  // Get jwt payload
  @Get('profile')
  getProfile(@Request() req: RequestType) {
    return req.user;
  }

  @Post('change-password')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Đổi mật khẩu thành công!',
      data: await this.authService.changePassword(body, user),
    };
  }

  // @Post('invalidate')
  // invalidateToken(@Request() req: RequestType) {
  //   const userId = (req.user as any).sub as string;
  //   return this.tokensStorageService.invalidateUserKeys(userId);
  // }

  // @Post('register')
  // @Public()
  // async register(@Body() body: SignUpDto) {
  //   return this.authService.register(body);
  // }

  @Get('mail')
  @Public()
  async verifyEmail() {
    await this.mailerService.sendMail({
      to: 'lcthanh.working@gmail.com', // list of receivers
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      html: '<b>Hello World!</b>', // HTML body content
    });
    return 'ok';
  }
}
