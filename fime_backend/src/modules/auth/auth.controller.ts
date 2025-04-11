import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Request as RequestType } from 'express';
import { LocalAuthGuard } from '@/modules/auth/passport/local-auth.guard';
import { User } from '@prisma/client';
import { Public } from '@/common/decorators/public-route.decorator';
import { SignUpDto } from '@/modules/auth/dto/signUp.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req: RequestType) {
    return this.authService.login(req.user as User);
  }

  @Get('profile')
  // @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: RequestType) {
    return req.user;
  }

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
