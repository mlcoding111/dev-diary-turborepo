import { Repository } from 'typeorm';
import { Integration } from '../../entities/integration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../core/utils/repository/base.repository';

@Injectable()
export class IntegrationRepository extends BaseRepository<Integration> {
  constructor(
    @InjectRepository(Integration)
    private readonly integrationRepository: Repository<Integration>,
  ) {
    super(integrationRepository);
  }
}
