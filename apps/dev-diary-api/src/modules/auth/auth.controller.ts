import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Validate } from '@/decorators/validation.decorator';
import { z } from 'zod';
import { ConfigService } from '@nestjs/config';
@Public()
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Validate({
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
  })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    console.log('login', req.user);
    return await this.authService.login(req.user);
  }

  @Validate({
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
  })
  @Post('auth/register')
  async register(@Request() req) {
    // get config service all keys
    const keys = this.configService.get('jwt');
    console.log('keys', keys);
    return await this.authService.register(req.body);
  }

  // @UseGuards(RefreshAuthGuard)
  // @Post('auth/refresh')
  // async refreshToken(@Request() req) {
  //   return await this.authService.refreshToken(req.user.id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('auth/logout')
  // async logout(@Request() req) {
  //   return await this.authService.logout(req.user.id);
  // }
}
