import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { ConfigService } from '@nestjs/config';
import { OAuthService } from '../oauth/oauth.service';
import { TNormalizedOAuthProfile, OAuthProviderType } from '@/types/auth';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private oauthService: OAuthService,
  ) {
    super({
      clientID: configService.get('githubOAuth.clientId'),
      clientSecret: configService.get('githubOAuth.clientSecret'),
      callbackURL: configService.get('githubOAuth.callbackUrl'),
      scope: ['user:email', 'read:user', 'repo'], // Scope to access repositories
      prompt: 'consent',
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    const normalizedProfile: TNormalizedOAuthProfile = {
      email: profile._json.email,
      first_name: profile._json.name.split(' ')[0] || '',
      last_name: profile._json.name.split(' ')[1] || '',
    };

    return await this.oauthService.handleOAuthConnection(
      req,
      accessToken,
      refreshToken,
      profile,
      OAuthProviderType.GITHUB,
      normalizedProfile,
    );
  }
}
