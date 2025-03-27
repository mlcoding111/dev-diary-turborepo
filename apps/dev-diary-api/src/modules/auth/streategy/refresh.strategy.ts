import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthJwtPayload } from '../types/jwt-payload';
import { Request } from 'express';
import { AuthService } from '../auth.service';

type Req = Request & {
  headers: {
    authorization?: string;
  };
};
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
      ignoreExpiration: false,
      // secretOrKey: 'dsadas',
      secretOrKey: configService.get<string>('refresh-jwt.secret') as string,
      passReqToCallback: true,
    };
    super(options);
  }

  async validate(req: Req, payload: AuthJwtPayload) {
    const refreshToken = req.headers.authorization
      ?.split(' ')[1]
      ?.trim() as string;
    const userId = Number(payload.sub);
    console.log('payload', payload);
    console.log('refreshToken', refreshToken);
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
