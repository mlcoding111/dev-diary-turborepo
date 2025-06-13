import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { BaseService } from '@/core/utils/service/base.service';
import { User } from '@/entities/user.entity';
import { IntegrationRepository } from '../integration/integration.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { Integration } from '@/entities/integration.entity';
import * as argon2 from 'argon2';
import { OAuthProviderType } from '@/types/auth';
import { IntegrationService } from '../integration/integration.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly integrationRepository: IntegrationRepository,
    private readonly integrationService: IntegrationService,
  ) {
    super(userRepository);
  }

  /**
   * Update all tokens for a user
   * @param user - User entity
   * @param access_token - Access token
   * @param refresh_token - Refresh token
   * @returns - User entity
   */
  async updateAllTokens(
    user: User,
    access_token: string,
    refresh_token: string,
  ): Promise<User> {
    const hashed_refresh_token = await argon2.hash(refresh_token);

    const updatedUserData: Partial<User> = {
      id: user.id,
      access_token,
      hashed_refresh_token: hashed_refresh_token,
      refresh_token,
    };
    return await this.userRepository.save(updatedUserData);
  }

  /**
   * Update the access token for a user
   * @param userId - User ID
   * @param accessToken - Access token
   * @returns - User entity
   */
  async updateAccessToken(userId: string, accessToken: string) {
    return await this.userRepository.save({
      id: userId,
      access_token: accessToken,
    });
  }

  /**
   * Update the hashed refresh token for a user
   * @param userId - User ID
   * @param refreshToken - Refresh token
   * @returns - User entity
   */
  async updateHashedRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);

    return await this.userRepository.save({
      id: userId,
      hashed_refresh_token: hashedRefreshToken,
      refresh_token: refreshToken,
    });
  }

  /**
   * Remove all tokens for a user
   * @param userId - User ID
   */
  async removeAllTokens(userId: string) {
    return await this.userRepository.save({
      id: userId,
      access_token: null,
      refresh_token: null,
      hashed_refresh_token: null,
    });
  }

  /**
   * Get a user by their access token
   * @param accessToken - Access token
   * @returns - User entity
   */
  async getUserByAccessToken(accessToken: string | null): Promise<User | null> {
    if (!accessToken) return null;
    const user = await this.userRepository.findOne({
      where: {
        access_token: accessToken,
      },
    });
    return user;
  }

  /**
   * Get a user by their ID
   * @param id - User ID
   * @returns - User entity
   */
  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //#region INTEGRATIONS
  /**
   * Upsert an integration for a user
   * @param user - User entity
   * @param integration - Integration entity
   * @returns - Integration entity
   */
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

  /**
   * Get the active integration for a user
   * @param user - User entity
   * @returns - Integration entity
   */
  async getActiveIntegration(user: User): Promise<Integration> {
    const integration = await this.integrationRepository.findOneBy({
      user_id: user.id,
      is_active: true,
    });

    if (!integration) {
      throw new NotFoundException('No active integration found');
    }

    return integration;
  }

  /**
   * Get all active integrations for a user
   * @param user - User entity
   * @returns - Array of Integration entities
   */
  async getAllActiveIntegrations(user: User): Promise<Integration[]> {
    const integrations = await this.integrationRepository.findBy({
      user_id: user.id,
      is_active: true,
    });

    if (!integrations || integrations.length === 0) {
      throw new NotFoundException('No active integrations found');
    }

    return integrations;
  }

  /**
   * Get all integrations for a user
   * @param user - User entity
   * @returns - Array of Integration entities
   */
  async getAllIntegrations(user: User): Promise<Integration[]> {
    const integrations = await this.integrationRepository.findBy({
      user_id: user.id,
    });

    if (!integrations || integrations.length === 0) {
      throw new NotFoundException('No integrations found');
    }

    return integrations;
  }

  /**
   * Disconnect an integration for a user
   * @param user - User entity
   * @param integrationId - Integration ID
   */
  async disconnectIntegration(user: User, integrationId: string) {
    const integration = await this.integrationRepository.findOneBy({
      id: integrationId,
      user_id: user.id,
    });

    // Check if there is another available intgration for this user
    const allActiveIntegrations = await this.getAllActiveIntegrations(user);

    if (allActiveIntegrations.length === 1) {
      throw new BadRequestException(
        'You must have at least one active integration',
      );
    }

    // If there is another active integration, set it as active
    if (allActiveIntegrations.length > 1) {
      const otherActiveIntegration = allActiveIntegrations.find(
        (integration) => integration.id !== integration.id,
      );
      await this.userRepository.save({
        id: user.id,
        active_integration_id: otherActiveIntegration?.id,
      });
    }

    await this.integrationRepository.save({
      ...integration,
      is_active: false,
    });
  }

  // Delete an integration for a user
  async deleteIntegration(user: User, integrationId: string) {
    const integration = await this.integrationRepository.findOneBy({
      id: integrationId,
      user_id: user.id,
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    const hasChanged = await this.changeActiveIntegrationIfPossible(
      user,
      integrationId,
    );

    if (!hasChanged) {
      throw new BadRequestException(
        'You must have at least one active integration',
      );
    }
    await this.integrationRepository.remove(integration);
  }

  async changeActiveIntegrationIfPossible(
    user: User,
    integrationId: string,
  ): Promise<boolean> {
    const allActiveIntegrations = await this.getAllActiveIntegrations(user);

    if (allActiveIntegrations.length === 1) {
      throw new BadRequestException(
        'You must have at least one active integration',
      );
    }

    // If there is another active integration, set it as active
    if (allActiveIntegrations.length > 1) {
      const otherActiveIntegration = allActiveIntegrations.find(
        (integration) => integration.id !== integrationId,
      );
      await this.userRepository.save({
        id: user.id,
        active_integration_id: otherActiveIntegration?.id,
      });
      return true;
    }

    return false;
  }

  /**
   * Connect an integration for a user
   * @param user - User entity
   * @param integrationId - Integration ID
   */
  async connectIntegration(user: User, integrationId: string) {
    const integration = await this.integrationService.getIntegrationById(
      user,
      integrationId,
    );

    await this.userRepository.save({
      id: user.id,
      active_integration_id: integration.id,
    });
  }
  //#endregion

  //#region EVENTS

  /**
   * Handle integration upsert event
   * @param event - Integration entity
   */
  @OnEvent('entity.afterUpsert.integration')
  async handleIntegrationAfterUpsert(event: Integration) {
    console.log('event', event);
    if (event.is_active && event.provider !== OAuthProviderType.GOOGLE) {
      await this.userRepository.save({
        id: event.user_id,
        active_integration_id: event.id,
      });
    }
  }
  //#endregion
}
