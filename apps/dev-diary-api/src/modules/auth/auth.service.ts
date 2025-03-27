
import { BadRequestException, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../models/users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { refreshJwtConfig } from '@/config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from './types/jwt-payload';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY) private refreshTokenConfig:ConfigType<typeof refreshJwtConfig>
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('Validating user', email, pass)
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const { access_token, refresh_token } = await this.generateTokens(user.id);
    const hashedRefreshToken = await argon2.hash(refresh_token);

    await this.usersService.updateHashedRefreshToken(user.id, hashedRefreshToken);

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  async register(user: any) {
    // check if user already exists
    const userExists = await this.usersService.findOneByEmail(user.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    return this.usersService.create(user);
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(userId: number) {
    const { access_token, refresh_token } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refresh_token);

    await this.usersService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return {
      id: userId,
      access_token,
      refresh_token,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);

    if(!user || !user.hashed_refresh_token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await argon2.verify(user.hashed_refresh_token, refreshToken);

    if(!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { id: userId };
  }

  async logout(userId: number) {
    await this.usersService.updateHashedRefreshToken(userId, null);
  }
}
