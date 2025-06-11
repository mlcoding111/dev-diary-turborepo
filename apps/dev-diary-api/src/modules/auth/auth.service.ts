import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthJwtPayload } from './types/jwt-payload';
import * as argon2 from 'argon2';
import { UserRepository } from '@/models/user/user.repository';
import { UserService } from '@/models/user/user.service';
import type { User } from '@/entities/user.entity';
import type { TRegisterUser, TSerializedUser } from '@repo/types/schema';

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
    if (user && (await argon2.verify(user.password, pass))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<TSerializedUser> {
    try {
      const { access_token, refresh_token } = await this.generateTokens(
        user.id,
        user.email,
      );
      const hashedRefreshToken = await argon2.hash(refresh_token);

      await this.userService.updateHashedRefreshToken(
        user.id,
        hashedRefreshToken,
        refresh_token,
      );

      await this.userService.updateAccessToken(user.id, access_token);

      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  async register(user: TRegisterUser): Promise<User> {
    // check if user already exists
    const userExists = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await argon2.hash(user.password);

    const savedUser: User = await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    return savedUser;
  }

  async registerOAuthUser(user: TRegisterUser): Promise<User> {
    const userExists = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Generate a random password
    const { hashedPassword } = await this.generateRandomPassword();

    const savedUser: User = await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    return savedUser;
  }

  async generateTokens(
    userId: string,
    email: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload: AuthJwtPayload = { sub: userId, email };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, this.configService.get('jwt')),
      this.jwtService.signAsync(payload, this.configService.get('refresh-jwt')),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(
    userId: string,
  ): Promise<{ id: string; access_token: string; refresh_token: string }> {
    const { access_token, refresh_token } = await this.generateTokens(
      userId,
      '',
    );
    const hashedRefreshToken = await argon2.hash(refresh_token);

    await this.userService.updateHashedRefreshToken(
      userId,
      hashedRefreshToken,
      refresh_token,
    );

    return {
      id: userId,
      access_token,
      refresh_token,
    };
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<{ id: string }> {
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

  async validateGoogleUser(user: TRegisterUser) {
    const existingUser = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (existingUser) return existingUser;
    return await this.register(user);
  }

  async validateGithubUser(user: Record<string, any>, githubToken: string) {
    const existingUser = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (existingUser) {
      await this.userService.upsertIntegration(existingUser, {
        provider: 'github',
        data: {
          access_token: githubToken,
          profile: user,
        },
      });
      return existingUser;
    }
    const createdUser = await this.register({
      email: user.email,
      first_name: user.name.split(' ')[0] || '',
      last_name: user.name.split(' ')[1] || '',
      password: (await this.generateRandomPassword()).password,
    });
    await this.userService.upsertIntegration(createdUser, {
      provider: 'github',
      data: {
        access_token: githubToken,
        profile: user,
      },
    });
    return createdUser;
  }

  async logout(userId: string) {
    await this.userService.updateHashedRefreshToken(userId, '');
  }

  async generateRandomPassword() {
    const password = process.env.TEMP_PASSWORD || '';
    // const password = Math.random().toString(36).substring(2, 15);
    const hashedPassword = await argon2.hash(password);
    return { password, hashedPassword };
  }
}
