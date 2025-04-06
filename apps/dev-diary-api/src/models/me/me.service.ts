import { Injectable } from '@nestjs/common';
import { BaseService } from '@/core/utils/service/base.service';
import { Me } from '@/entities/me.entity';
import { MeRepository } from './me.repository';

@Injectable()
export class MeService extends BaseService<Me> {
  constructor(private readonly meRepository: MeRepository) {
    super(meRepository);
  }
}
