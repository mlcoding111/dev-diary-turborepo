import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { refreshJwtConfig } from '@/config/refresh-jwt.config';
import { AuthJwtPayload } from '../types/jwt-payload';
import { Request } from 'express';
import { AuthService } from '../auth.service';
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshJwtConfig.KEY) 
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //   jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
      ignoreExpiration: false,
      secretOrKey: refreshJwtConfiguration.secret,
      passReqToCallback: true,
    });
  }
  // TODO: To Type
  async validate(req: Request, payload: AuthJwtPayload) {
    const refreshToken = req.get('authorization').split(' ')[1].trim();
    const userId = Number(payload.sub);
    console.log('payload', payload)
    console.log('refreshToken', refreshToken)
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
