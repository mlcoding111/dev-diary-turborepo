import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthJwtPayload } from '../types/jwt-payload';

type Req = {
  cookies: {
    access_token: string;
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Req) => req?.cookies?.access_token || null, // ← get token from cookie
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') as string,
    });
  }

  validate(payload: AuthJwtPayload): { sub: string; email: string } {
    if (!payload?.sub || !payload?.email) {
      throw new UnauthorizedException('Malformed JWT payload');
    }
    return { sub: payload.sub, email: payload.email };
  }
}
