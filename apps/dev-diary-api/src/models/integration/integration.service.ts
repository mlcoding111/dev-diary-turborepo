import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@/core/utils/service/base.service';
import { Integration } from '@/entities/integration.entity';
import { IntegrationRepository } from './integration.repository';
import { RequestContextService } from '@/modules/request/request-context.service';
import { TSerializedUser } from '@repo/types/schema';

@Injectable()
export class IntegrationService extends BaseService<Integration> {
  constructor(
    private readonly integrationRepository: IntegrationRepository,
    private readonly requestContextService: RequestContextService,
  ) {
    super(integrationRepository);
  }

  async getActiveIntegration(user: TSerializedUser): Promise<Integration> {
    if (!user.active_integration_id) {
      throw new NotFoundException('No active integration found');
    }

    const integration = await this.integrationRepository.findOneBy({
      user_id: user.id,
      id: user.active_integration_id,
    });

    if (!integration) {
      throw new NotFoundException('No active integration found');
    }

    return integration;
  }

  async getIntegrationById(
    user: TSerializedUser,
    integrationId: string,
  ): Promise<Integration> {
    const integration = await this.integrationRepository.findOneBy({
      user_id: user.id,
      id: integrationId,
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return integration;
  }
}
