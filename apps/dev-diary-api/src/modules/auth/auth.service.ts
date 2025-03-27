import {
  BadRequestException,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { refreshJwtConfig } from '@/config/refresh-jwt.config';
import { ConfigService } from '@nestjs/config';
import { AuthJwtPayload } from './types/jwt-payload';
import * as argon2 from 'argon2';
import { UserRepository } from '@/models/user/user.repository';
import { UserService } from '@/models/user/user.service';
import type { User } from '@/entities/user.entity';
import { TCreateUser } from '@/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<{
    user: User;
    access_token: string;
    refresh_token: string;
  }> {
    const { access_token, refresh_token } = await this.generateTokens(user.id);
    const hashedRefreshToken = await argon2.hash(refresh_token);

    await this.userService.updateHashedRefreshToken(
      user.id,
      hashedRefreshToken,
    );

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  async register(user: TCreateUser): Promise<User> {
    // check if user already exists
    const userExists = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }

  async generateTokens(userId: number): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload: any = { sub: userId };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.configService.get('refresh-jwt')),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(
    userId: number,
  ): Promise<{ id: number; access_token: string; refresh_token: string }> {
    const { access_token, refresh_token } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refresh_token);

    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return {
      id: userId,
      access_token,
      refresh_token,
    };
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<{ id: number }> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user || !user.hashed_refresh_token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await argon2.verify(
      user.hashed_refresh_token,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { id: userId };
  }

  async logout(userId: number) {
    await this.userService.updateHashedRefreshToken(userId, '');
  }
}
