import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { BaseService } from '@/core/utils/service/base.service';
import { User } from '@/entities/user.entity';
import { IntegrationRepository } from '../integration/integration.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { Integration } from '@/entities/integration.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly integrationRepository: IntegrationRepository,
  ) {
    super(userRepository);
  }

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
    refreshToken?: string | null,
  ) {
    // If there is a refreshToken, take it. Else, if hashedRefreshToken is null, set refreshToken to null.
    // Else, if there is no refreshToken, do not save anything.
    const refreshTokenToSave =
      refreshToken ?? (hashedRefreshToken ? null : undefined);
    return await this.userRepository.save({
      id: userId,
      hashed_refresh_token: hashedRefreshToken,
      ...(refreshTokenToSave && { refresh_token: refreshTokenToSave }),
    });
  }

  async updateAccessToken(userId: string, accessToken: string) {
    console.log('updateAccessToken', userId, accessToken);
    return await this.userRepository.save({
      id: userId,
      access_token: accessToken,
    });
  }

  async getUserByAccessToken(accessToken: string | null): Promise<User | null> {
    if (!accessToken) return null;
    const user = await this.userRepository.findOne({
      where: {
        access_token: accessToken,
      },
    });
    return user;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async upsertIntegration(user: User, integration: Record<string, any>) {
    if (!user || !integration.provider) {
      throw new Error('Missing user or provider info');
    }

    const existingIntegration = await this.integrationRepository.findOneBy({
      user_id: user.id,
      provider: integration.provider,
    });

    if (existingIntegration) {
      return await this.integrationRepository.save({
        ...existingIntegration,
        data: integration.data,
      });
    }

    return await this.integrationRepository.save({
      user_id: user.id,
      type: integration.provider,
      data: integration.data,
    });
  }

  //#region EVENTS

  /**
   * Handle integration upsert event
   * @param event - Integration entity
   */
  @OnEvent('entity.afterUpsert.integration')
  async handleIntegrationAfterUpsert(event: Integration) {
    if (event.is_active) {
      await this.userRepository.save({
        id: event.user_id,
        active_integration_id: event.id,
      });
    }
  }
  //#endregion
}
