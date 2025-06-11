import { User } from '@/entities/user.entity';
import { IntegrationRepository } from '@/models/integration/integration.repository';
import { UserRepository } from '@/models/user/user.repository';
import { UserService } from '@/models/user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GitProviderType } from '@repo/types/integrations';

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
  ) {
    // If access token is present, try to find user by access token
    const accessTokenCookie = req?.cookies['access_token'] || null;
    const user = await this.userService.getUserByAccessToken(accessTokenCookie);

    // User was found, simply return the user and update the integration data
    if (user) {
      return user;
    }

    // User was not found, create a new user

    const newUser = await this.userService.createUser(profile);
    return newUser;
  }

  async handleOAuthLogin(profile: any, sessionUserId?: string) {
    const { provider, providerId, email, raw } = profile;

    // CASE 1: User is logged in -> link new integration
    if (sessionUserId) {
      const user = await this.usersRepo.findOneBy({ id: sessionUserId });
      if (!user) throw new NotFoundException('User not found');
      await this.linkIntegration(user, provider, providerId, email, raw);
      return user;
    }

    // CASE 2: Try to find by integration
    const integration = await this.integrationsRepo.findOne({
      where: { provider, user: { id: sessionUserId } },
      relations: ['user'],
    });

    if (integration) return integration.user;

    // CASE 3: Try to find user by email (be careful here)
    let user = email ? await this.usersRepo.findOneBy({ email }) : null;

    if (!user) {
      user = this.usersRepo.create({ email });
      await this.usersRepo.save(user);
    }

    // Link integration
    await this.linkIntegration(user, provider, providerId, email, raw);
    return user;
  }

  private async linkIntegration(
    user: User,
    provider: GitProviderType,
    providerId: string,
    email: string | null,
    rawProfile: any,
  ) {
    const existing = await this.integrationsRepo.findOneBy({
      provider,
      user: { id: user.id },
    });
    if (existing) return;

    return await this.integrationsRepo.save({
      provider,
      providerId,
      email,
      user,
      rawProfile,
    });
  }
}
