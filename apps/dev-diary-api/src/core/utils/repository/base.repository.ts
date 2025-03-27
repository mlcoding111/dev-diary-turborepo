import { Repository, ObjectLiteral, DeepPartial } from 'typeorm';
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

  async mergeAndUpdate(entity: T, partialEntity: DeepPartial<T>): Promise<T> {
    const mergedEntity = this.merge(entity, partialEntity);
    return await this.save(mergedEntity);
  }

  // getQueryBuilder(): SelectQueryBuilder<T> {
  //   return this.createQueryBuilder(this.metadata.tableName);
  // }
}
