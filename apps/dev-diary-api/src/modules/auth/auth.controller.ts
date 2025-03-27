import { Controller, Request, Post, UseGuards, BadRequestException } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Validate } from '@/decorators/validation.decorator';
import { z } from 'zod';
import { ConfigService } from '@nestjs/config';
import type {
  TRegisterUser,
  TUserLoginOutput,
  TUserLoginOutputSerialized,
} from '@repo/types/schema';
import { Body } from '@nestjs/common';
import { registerUserSchema, userLoginOutputSchema } from '@repo/types/schema';
import { User } from '@/entities/user.entity';
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
    input: registerUserSchema,
    output: userLoginOutputSchema,
  })
  @Post('auth/register')
  async register(
    @Body() body: TRegisterUser,
  ): Promise<TUserLoginOutputSerialized> {
    const user = await this.authService.register(body);
    const loggedUser: TUserLoginOutput = await this.authService.login(user);
    if (!loggedUser) {
      throw new BadRequestException('Failed to login');
    }
    const serializedUser = new User(loggedUser.user);
    // const serializedUser = new User(loggedUser.user);
    console.log('loggedUser', loggedUser);
    return loggedUser;
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
