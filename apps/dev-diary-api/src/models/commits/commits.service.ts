import { Injectable } from '@nestjs/common';
import { BaseService } from '@/core/utils/service/base.service';

@Injectable()
export class CommitsService extends BaseService<Commits> {
  constructor(private readonly commitsRepository: CommitsRepository) {
    super(commitsRepository);
  }
}
