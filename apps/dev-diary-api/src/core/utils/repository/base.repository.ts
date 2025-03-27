import { Repository, ObjectLiteral } from 'typeorm';
import { Injectable } from '@nestjs/common';

// If we ever need to add more methods to the repository, we can do it here
// interface IBaseRepository<T extends ObjectLiteral> extends Repository<T> {

// }

@Injectable()
// implements IBaseRepository<T>
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(private readonly repository: Repository<T>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // getQueryBuilder(): SelectQueryBuilder<T> {
  //   return this.createQueryBuilder(this.metadata.tableName);
  // }
}
