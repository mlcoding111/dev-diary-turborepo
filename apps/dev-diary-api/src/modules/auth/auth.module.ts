import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@/models/users/users.module';
import { LocalStrategy } from './streategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './streategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from '@/config/jwt.config';
import { refreshJwtConfig } from '@/config/refresh-jwt.config';
import { RefreshJwtStrategy } from './streategy/refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync(jwtConfig.asProvider()),  
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
