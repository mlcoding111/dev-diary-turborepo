import { Repository, ObjectLiteral } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(private readonly repository: Repository<T>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
