import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-bitbucket-oauth20';
import { ConfigService } from '@nestjs/config';
import { OAuthService } from '../oauth/oauth.service';
import { TNormalizedOAuthProfile, OAuthProviderType } from '@/types/auth';

@Injectable()
export class BitbucketStrategy extends PassportStrategy(Strategy, 'bitbucket') {
  constructor(
    private configService: ConfigService,
    private oauthService: OAuthService,
  ) {
    super({
      clientID: configService.get('bitbucketOAuth.clientId'),
      clientSecret: configService.get('bitbucketOAuth.clientSecret'),
      callbackURL: configService.get('bitbucketOAuth.callbackUrl'),
      scope: 'account email repository',
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    const emails = profile.emails || [];
    const primaryEmail =
      emails.find((e: any) => e.primary)?.value || emails[0]?.value;

    if (!primaryEmail) {
      throw new UnauthorizedException('User email not found');
    }

    const fullName = profile.displayName || '';
    const [firstName = '', lastName = ''] = fullName.split(' ');

    const normalizedProfile: TNormalizedOAuthProfile = {
      email: primaryEmail,
      first_name: firstName,
      last_name: lastName,
      avatar_url: profile._json.avatar_url || '',
      username: profile._json.username || '',
      profile_url: profile._json.links.html.href || '',
    };

    return await this.oauthService.handleOAuthConnection(
      req,
      accessToken,
      refreshToken,
      profile,
      OAuthProviderType.BITBUCKET,
      normalizedProfile,
    );
  }
}
