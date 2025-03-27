import {
  Controller,
  Request,
  Post,
  UseGuards,
  BadRequestException,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
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
  TUserLoginInput,
} from '@repo/types/schema';
import { Body } from '@nestjs/common';
import {
  registerUserSchema,
  userLoginOutputSchemaSerialized,
} from '@repo/types/schema';
import { User } from '@/entities/user.entity';
import { UserRepository } from '@/models/user/user.repository';

@Public()
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {}

  @Validate({
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
    output: userLoginOutputSchemaSerialized,
  })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Body() body: TUserLoginInput,
  ): Promise<TUserLoginOutputSerialized> {
    const user: User | null = await this.userRepository.findOneBy({
      email: body.email,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const loggedUser: TUserLoginOutput = await this.authService.login(user);
    const serializedUser = new User(user);
    return {
      user: serializedUser,
      access_token: loggedUser.access_token,
      refresh_token: loggedUser.refresh_token,
    };
  }

  @Validate({
    input: registerUserSchema,
    output: userLoginOutputSchemaSerialized,
  })
  @Post('auth/register')
  async register(
    @Body() body: TRegisterUser,
  ): Promise<TUserLoginOutputSerialized> {
    const user: User = await this.authService.register(body);
    const loggedUser: TUserLoginOutput = await this.authService.login(user);
    if (!loggedUser) {
      throw new BadRequestException('Failed to login');
    }
    // get the user
    const userData = await this.userRepository.findOneBy({ id: user.id });
    if (!userData) {
      throw new BadRequestException('User not found');
    }
    const serializedUser = new User(userData);
    return {
      user: serializedUser,
      access_token: loggedUser.access_token,
      refresh_token: loggedUser.refresh_token,
    };
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
