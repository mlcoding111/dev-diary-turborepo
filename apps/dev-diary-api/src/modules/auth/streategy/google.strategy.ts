import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { VerifyCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService?.get('googleOAuth.clientId'),
      clientSecret: configService?.get('googleOAuth.clientSecret'),
      callbackURL: configService?.get('googleOAuth.callbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  // Add type for payload of validateGoogleUser
  // Add logo avatar url to user
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // done: VerifyCallback,
  ) {
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      first_name: profile.name.givenName,
      last_name: profile.name.familyName,
      //   avatarUrl: profile.photos[0].value,
      password: '',
    });
    return user;
  }
}
