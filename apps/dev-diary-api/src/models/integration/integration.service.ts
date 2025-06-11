import { Injectable } from '@nestjs/common';
import { BaseService } from '@/core/utils/service/base.service';
import { Integration } from '@/entities/integration.entity';
import { IntegrationRepository } from './integration.repository';
@Injectable()
export class IntegrationService extends BaseService<Integration> {
  constructor(private readonly integrationRepository: IntegrationRepository) {
    super(integrationRepository);
  }
}
