import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integration } from '../../entities/integration.entity';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { IntegrationRepository } from './integration.repository';
import { IntegrationSubscriber } from './integration.subscriber';
import { IntegrationListener } from './integration.listener';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Integration]), UserModule],
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
