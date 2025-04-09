import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Request as RequestType } from 'express';
import { LocalAuthGuard } from '@/modules/auth/passport/local-auth.guard';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/passport/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req: RequestType) {
    return this.authService.login(req.user as User);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: RequestType) {
    return req.user;
  }
}
