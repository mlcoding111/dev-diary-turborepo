import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { ConfigService } from '@nestjs/config';
import { OAuthService } from '../oauth/oauth.service';
import { TNormalizedOAuthProfile, OAuthProviderType } from '@/types/auth';
import { GithubService } from '@/modules/github/github.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private oauthService: OAuthService,
    private githubService: GithubService,
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
    const userEmail: string =
      await this.githubService.getUserEmail(accessToken);

    if (!userEmail) {
      throw new UnauthorizedException('User email not found');
    }

    const normalizedProfile: TNormalizedOAuthProfile = {
      email: userEmail,
      first_name: profile._json.name?.split(' ')[0] || '',
      last_name: profile._json.name?.split(' ')[1] || '',
      avatar_url: profile._json.avatar_url || '',
      username: profile._json.login || '',
      profile_url: profile._json.html_url || '',
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
