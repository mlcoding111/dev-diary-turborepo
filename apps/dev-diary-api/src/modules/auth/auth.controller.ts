import {
  Controller,
  Post,
  UseGuards,
  BadRequestException,
  ClassSerializerInterceptor,
  UseInterceptors,
  Req,
  Get,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Validate } from '@/decorators/validation.decorator';
import { z } from 'zod';
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
import { RequestContextService } from '@/modules/request/request-context.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthGuard } from '@nestjs/passport';
@Public()
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userRepository: UserRepository,
    private readonly clsService: RequestContextService,
  ) {}

  @Validate({
    input: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
    output: userLoginOutputSchemaSerialized,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() body: TUserLoginInput,
  ): Promise<TUserLoginOutputSerialized> {
    const user: User | null = await this.userRepository.findOneBy({
      email: body.email,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const loggedUser = await this.authService.login(user);

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
  @Post('register')
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

  @Validate({
    bypass: true,
  })
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken() {
    const user = this.clsService.get('user');
    return await this.authService.refreshToken(user.id);
  }

  @Validate({
    bypass: true,
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res) {
    const user = this.clsService.get('user');
    console.log('The user', user);
    // Clear cookies by setting them to expire in the past
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return await this.authService.logout(user.id);
  }

  // TODO: Implement this
  private async serializeUserLoginOutput(
    user: TUserLoginOutput,
  ): Promise<TUserLoginOutputSerialized> {
    const userData = await this.userRepository.findOneBy({ id: user.user.id });
    if (!userData) {
      throw new BadRequestException('User not found');
    }
    const serializedUser = new User(userData);
    return {
      user: serializedUser,
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleAuth() {}

  // TODO: type user
  @Validate({
    bypass: true,
  })
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(@Req() req, @Res() res) {
    const loginResponse = await this.authService.login(req.user);
    if (!loginResponse) {
      throw new UnauthorizedException();
    }
    // ✅ Set a secure cookie
    res.cookie('access_token', loginResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax', // Or 'Strict' / 'None' depending on your use case
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.cookie('refresh_token', loginResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // Optional: redirect to your frontend (without passing token in URL)
    res.redirect(`${process.env.WEB_APP_URL}`);
  }

  @Public()
  @UseGuards(AuthGuard('github'))
  @Get('github/login')
  async githubAuth() {}

  @Validate({
    bypass: true,
  })
  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req, @Res() res) {
    const loginResponse = await this.authService.login(req.user.user);

    if (!loginResponse) {
      throw new UnauthorizedException();
    }

    res.redirect(
      `${process.env.WEB_APP_URL}?token=${loginResponse.access_token}`,
    );
  }
}
