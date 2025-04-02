import { Injectable } from '@nestjs/common';
import { BaseService } from '@/core/utils/service/base.service';
import { Session } from '@/entities/session.entity';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService extends BaseService<Session> {
  constructor(private readonly sessionRepository: SessionRepository) {
    super(sessionRepository);
  }
}
