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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Integration } from '@/entities/integration.entity';

@Injectable()
export class OAuthService {
  constructor(
    private readonly usersRepo: UserRepository,
    private readonly integrationsRepo: IntegrationRepository,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
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
      user = await this.usersRepo.findOneBy({
        email: normalizedProfile.email,
      });
      if (!user) {
        user = await this.registerOAuthUser(normalizedProfile);
      }
    }
    // Link integration
    await this.upsertIntegration(
      user,
      provider,
      accessToken,
      refreshToken,
      profile,
    );

    return user;
  }

  async registerOAuthUser(
    normalizedProfile: TNormalizedOAuthProfile,
  ): Promise<User> {
    const existingUser = await this.usersRepo.findOneBy({
      email: normalizedProfile.email,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Generate a random password
    const password = process.env.TEMP_PASSWORD || '';
    const hashedPassword = await argon2.hash(password);

    const savedUser: User = await this.usersRepo.save({
      ...normalizedProfile,
      password: hashedPassword,
    });

    return savedUser;
  }

  private async upsertIntegration(
    user: User,
    provider: OAuthProviderType,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    let integration: Integration | null = null;
    try {
      const existing = await this.integrationsRepo.findOneBy({
        provider,
        user_id: user.id,
      });

      if (existing) {
        integration = await this.integrationsRepo.save({
          ...existing,
          access_token: accessToken,
          refresh_token: refreshToken,
          data: profile,
          is_active: true,
        });
      } else {
        integration = await this.integrationsRepo.save({
          provider,
          user_id: user.id,
          access_token: accessToken,
          refresh_token: refreshToken,
          data: profile,
        });
      }

      this.eventEmitter.emit('entity.afterUpsert.integration', integration);

      return integration;
    } catch (error) {
      console.error('Error linking integration', error);
      throw new InternalServerErrorException('Error linking integration');
    }
  }
}
