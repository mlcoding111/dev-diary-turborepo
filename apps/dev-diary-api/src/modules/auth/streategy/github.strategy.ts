import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { GithubService } from '@/modules/github/github.service';
import { UserService } from '@/models/user/user.service';
import { RequestContextService } from '@/modules/request/request-context.service';
import { User } from '@/entities/user.entity';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private githubService: GithubService,
    private userService: UserService,
    private requestContextService: RequestContextService,
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

  // TODO: For now, we are using the profile._json to get the email
  // TODO: Eventually, we should use the whole profile object to get more data
  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    let user: User | null = null;
    const primaryEmail = await this.githubService.getUserEmail(accessToken);
    // console.log('The primary email is', primaryEmail);
    // console.log('The profile is', profile);
    console.log('The state is', req.query.state);
    if (!primaryEmail) {
      throw new UnauthorizedException('Github primary email not found');
    }

    profile._json.email = primaryEmail;

    // If user is not found, create a new user
    // user = await this.authService.validateGithubUser(
    //   profile._json as Record<string, any>,
    //   accessToken,
    // );
    // // Either user is not found or user is not valid
    // // Return unauthorized
    // if (!user) {
    //   return false;
    // }
    return { accessToken, profile, user: profile._json };
  }
}
