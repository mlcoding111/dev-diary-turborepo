import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './streategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '@/models/user/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './streategy/jwt.strategy';
import { jwtConfig } from '@/config/jwt.config';
import { RefreshJwtStrategy } from './streategy/refresh.strategy';
import { GoogleStrategy } from './streategy/google.strategy';
import { googleOAuthConfig } from '@/config/google-oauth.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(googleOAuthConfig),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    JwtService,
    GoogleStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
