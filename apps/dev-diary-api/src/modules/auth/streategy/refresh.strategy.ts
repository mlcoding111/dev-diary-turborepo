import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import type { ConfigService, ConfigType } from '@nestjs/config';
import { refreshJwtConfig } from '@/config/refresh-jwt.config';
import { AuthJwtPayload } from '../types/jwt-payload';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private readonly configService: ConfigService,
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService,
  ) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('refresh-jwt.secret'),
      passReqToCallback: true,
    };
    super(options);
  }

  async validate(
    req: Request & { headers: { authorization?: string } },
    payload: AuthJwtPayload,
  ) {
    const refreshToken = req.headers.authorization
      ?.split(' ')[1]
      ?.trim() as string;
    const userId = Number(payload.sub);
    console.log('payload', payload);
    console.log('refreshToken', refreshToken);
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
