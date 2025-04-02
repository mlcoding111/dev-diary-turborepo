import { Repository } from 'typeorm';
import { Session } from '../../entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../core/utils/repository/base.repository';

@Injectable()
export class SessionRepository extends BaseRepository<Session> {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {
    super(sessionRepository);
  }
}
