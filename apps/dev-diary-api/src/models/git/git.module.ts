import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitService } from './git.service';
import { GitController } from './git.controller';
import { IntegrationRepository } from '../integration/integration.repository';
import { Integration } from '@/entities/integration.entity';
import { IntegrationService } from '../integration/integration.service';

@Module({
  imports: [TypeOrmModule.forFeature([Integration])],
  providers: [GitService, IntegrationRepository, IntegrationService],
  controllers: [GitController],
  exports: [GitService],
})
export class GitModule {}
