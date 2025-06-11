import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { ConfigService } from '@nestjs/config';
import { OAuthService } from '../oauth/oauth.service';
import { GitProviderType } from '@repo/types/integrations';

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
    return await this.oauthService.handleOAuthConnection(
      req,
      accessToken,
      refreshToken,
      profile,
      GitProviderType.GITHUB,
    );
  }
}
