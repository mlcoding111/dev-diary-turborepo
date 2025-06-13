import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { BaseService } from '@/core/utils/service/base.service';
import { User } from '@/entities/user.entity';
import { IntegrationRepository } from '../integration/integration.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { Integration } from '@/entities/integration.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { OAuthProviderType } from '@/types/auth';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly integrationRepository: IntegrationRepository,
    private readonly jwtService: JwtService,
  ) {
    super(userRepository);
  }

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

  async updateAccessToken(userId: string, accessToken: string) {
    return await this.userRepository.save({
      id: userId,
      access_token: accessToken,
    });
  }

  async updateHashedRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);

    return await this.userRepository.save({
      id: userId,
      hashed_refresh_token: hashedRefreshToken,
      refresh_token: refreshToken,
    });
  }

  async removeAllTokens(userId: string) {
    return await this.userRepository.save({
      id: userId,
      access_token: null,
      refresh_token: null,
      hashed_refresh_token: null,
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

  //#region INTEGRATIONS
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

  async getAllIntegrations(user: User): Promise<Integration[]> {
    const integrations = await this.integrationRepository.findBy({
      user_id: user.id,
    });

    if (!integrations || integrations.length === 0) {
      throw new NotFoundException('No integrations found');
    }

    return integrations;
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
