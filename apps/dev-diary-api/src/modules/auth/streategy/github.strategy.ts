import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('githubOAuth.clientId'),
      clientSecret: configService.get('githubOAuth.clientSecret'),
      callbackURL: configService.get('githubOAuth.callbackUrl'),
      scope: ['user:email', 'read:user', 'repo'], // Scope to access repositories
      prompt: 'consent',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { Octokit } = await import('@octokit/rest');
    const octokit = new Octokit({ auth: accessToken });
    const [response, userResponse] = await Promise.all([
      octokit.request('GET /user/emails'),
      octokit.request('GET /user'),
    ]);
    const primaryEmail = response.data.filter((e) => e.primary === true)[0]
      ?.email;
    userResponse.data.email = primaryEmail;

    if (!primaryEmail) {
      throw new UnauthorizedException('Github primary email not found');
    }

    profile._json.email = primaryEmail;
    const user = await this.authService.validateGithubUser(
      userResponse.data,
      accessToken,
    );
    return { accessToken, profile, user };
  }
}
