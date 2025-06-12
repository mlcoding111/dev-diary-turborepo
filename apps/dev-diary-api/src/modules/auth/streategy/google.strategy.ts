import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { OAuthService } from '../oauth/oauth.service';
import { TNormalizedOAuthProfile, OAuthProviderType } from '@/types/auth';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly oauthService: OAuthService,
  ) {
    super({
      clientID: configService?.get('googleOAuth.clientId'),
      clientSecret: configService?.get('googleOAuth.clientSecret'),
      callbackURL: configService?.get('googleOAuth.callbackUrl'),
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  // Add type for payload of validateGoogleUser
  // Add logo avatar url to user
  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    const normalizedProfile: TNormalizedOAuthProfile = {
      email: profile.emails[0].value,
      first_name: profile.name.givenName,
      last_name: profile.name.familyName,
      avatar_url: profile.photos[0].value || '',
      username: profile.displayName || '',
      profile_url: profile.profileUrl || '',
    };
    return await this.oauthService.handleOAuthConnection(
      req,
      accessToken,
      refreshToken,
      profile,
      OAuthProviderType.GOOGLE,
      normalizedProfile,
    );
  }
}
