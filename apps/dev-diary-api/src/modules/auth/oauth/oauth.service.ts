import { User } from '@/entities/user.entity';
import { IntegrationRepository } from '@/models/integration/integration.repository';
import { UserRepository } from '@/models/user/user.repository';
import { UserService } from '@/models/user/user.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { TNormalizedOAuthProfile, OAuthProviderType } from '@/types/auth';

@Injectable()
export class OAuthService {
  constructor(
    private readonly usersRepo: UserRepository,
    private readonly integrationsRepo: IntegrationRepository,
    private readonly userService: UserService,
  ) {}

  async handleOAuthConnection(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    provider: OAuthProviderType,
    normalizedProfile: TNormalizedOAuthProfile,
  ) {
    // If access token is present, try to find user by access token
    const accessTokenCookie: string | null =
      req?.cookies['access_token'] || null;
    let user = await this.userService.getUserByAccessToken(accessTokenCookie);
    // User was found, simply return the user and update the integration data
    if (!user) {
      user = await this.registerOAuthUser(normalizedProfile);
    }
    // Link integration
    await this.linkIntegration(
      user,
      provider,
      accessToken,
      refreshToken,
      profile,
    );

    return user;
  }

  async registerOAuthUser(user: TNormalizedOAuthProfile): Promise<User> {
    const userExists = await this.usersRepo.findOneBy({
      email: user.email,
    });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Generate a random password
    const password = 'asdasd';
    const hashedPassword = await argon2.hash(password);

    const savedUser: User = await this.usersRepo.save({
      ...user,
      password: hashedPassword,
    });

    return savedUser;
  }

  private async linkIntegration(
    user: User,
    provider: OAuthProviderType,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    try {
      const existing = await this.integrationsRepo.findOneBy({
        provider,
        user: { id: user.id },
      });
      if (existing) {
        return await this.integrationsRepo.save({
          ...existing,
          access_token: accessToken,
          refresh_token: refreshToken,
          data: profile,
        });
      }

      return await this.integrationsRepo.save({
        provider,
        user,
        access_token: accessToken,
        refresh_token: refreshToken,
        data: profile,
      });
    } catch (error) {
      console.error('Error linking integration', error);
      throw new InternalServerErrorException('Error linking integration');
    }
  }
}
