import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { jwtConfig } from '@/config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) 
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret,
    });
  }
  // TODO: To Type
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}


// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       // We will try to extract the JWT from the cookie first
//       // If it's not there, we will try to extract it from the Authorization header as a fallback
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         JwtStrategy.extractJWT,
//         ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: configService.get('auth.JWT_SECRET'),
//     });
//   }

//   private static extractJWT(req: RequestType): string | null {
//     let token = null;
//     if (req && req.cookies) {
//       token = req.cookies['access_token'];
//     }

//     return token;
//   }

//   async validate(payload: AccessTokenPayload) {
//     return payload;
//   }
// }
