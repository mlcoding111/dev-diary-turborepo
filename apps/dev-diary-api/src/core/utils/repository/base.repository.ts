import { Repository, ObjectLiteral } from 'typeorm';
import { Injectable } from '@nestjs/common';

export interface IBaseRepository<T extends ObjectLiteral>
  extends Repository<T> {}

@Injectable()
export class BaseRepository<T extends ObjectLiteral>
  extends Repository<T>
  implements IBaseRepository<T>
{
  constructor(private readonly repository: Repository<T>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
