import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from '@/modules/auth/dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.emailOrPhone, signInDto.password);
  }
}
