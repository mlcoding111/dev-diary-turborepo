import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '@/models/user/user.module';

import { jwtConfig } from '@/config/jwt.config';

import { googleOAuthConfig } from '@/config/google-oauth.config';
import { ConfigModule } from '@nestjs/config';
import { githubOAuthConfig } from '@/config/github-oauth.config';
import { GithubService } from '@/modules/github/github.service';
import { GoogleStrategy } from '../streategy/google.strategy';
import { OAuthService } from './oauth.service';
import { IntegrationModule } from '@/models/integration/integration.module';
// import { OAuthService } from './oauth.service';
@Module({
  imports: [UserModule, IntegrationModule],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
