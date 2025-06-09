import { Injectable } from '@nestjs/common';
import { BaseService } from '@/core/utils/service/base.service';

@Injectable()
export class GitService extends BaseService<any> {
  constructor() {
    super();
  }
}
