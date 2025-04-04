import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') as string,
    });
  }
  // TODO: To Type
  validate(payload: any): { id: string; email: string } {
    // console.log('THE PAYLOAD', payload);
    return { id: payload.sub, email: payload.email };
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
