import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integration } from '../../entities/integration.entity';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { IntegrationRepository } from './integration.repository';
import { IntegrationSubscriber } from './integration.subscriber';
import { IntegrationListener } from './integration.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Integration])],
  providers: [
    IntegrationService,
    IntegrationRepository,
    IntegrationSubscriber,
    IntegrationListener,
  ],
  controllers: [IntegrationController],
  exports: [IntegrationService, IntegrationRepository],
})
export class IntegrationModule {}
