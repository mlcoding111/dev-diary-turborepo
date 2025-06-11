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
  Param,
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
  TUserLoginInput,
  TSerializedUser,
} from '@repo/types/schema';
import { Body } from '@nestjs/common';
import {
  registerUserSchema,
  userLoginOutputSchemaSerialized,
  userSchemaSerialized,
} from '@repo/types/schema';
import { User } from '@/entities/user.entity';
import { UserRepository } from '@/models/user/user.repository';
import { RequestContextService } from '@/modules/request/request-context.service';
import { GitProviderType, OAuthProviderType } from '@repo/types/integrations';
import { DynamicAuthGuardFactory } from './guards/dynamic-auth.guard';

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
    output: userSchemaSerialized,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: TUserLoginInput): Promise<TSerializedUser> {
    const user: User | null = await this.userRepository.findOneBy({
      email: body.email,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const loggedUser = await this.authService.login(user);

    return new User(loggedUser);
  }

  @Validate({
    input: registerUserSchema,
    output: userLoginOutputSchemaSerialized,
  })
  @Post('register')
  async register(@Body() body: TRegisterUser): Promise<TSerializedUser> {
    const user: User = await this.authService.register(body);
    const loggedUser: TSerializedUser = await this.authService.login(user);
    if (!loggedUser) {
      throw new BadRequestException('Failed to login');
    }
    // get the user
    const userData = await this.userRepository.findOneBy({ id: user.id });
    if (!userData) {
      throw new BadRequestException('User not found');
    }

    return new User(userData);
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
  async logout(@Res({ passthrough: true }) res: any) {
    const user = this.clsService.get('user');

    // Clear cookies by setting them to expire in the past
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return await this.authService.logout(user?.sub || '');
  }

  @Validate({
    bypass: true,
  })
  @Public()
  @Get(':provider')
  @UseGuards(DynamicAuthGuardFactory())
  async redirectToProvider(@Param('provider') provider: GitProviderType) {}

  @Validate({
    bypass: true,
  })
  @Get(':provider/callback')
  @UseGuards(DynamicAuthGuardFactory())
  async handleCallback(
    @Param('provider') provider: OAuthProviderType,
    @Req() req,
    @Res() res,
  ) {
    const loginResponse = await this.authService.login(req.user);

    if (!loginResponse) {
      throw new UnauthorizedException();
    }
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

    res.redirect(`${process.env.WEB_APP_URL}/dashboard`);
  }
}
