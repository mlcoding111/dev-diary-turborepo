// Every service should extend this class

import { ObjectLiteral, Repository } from 'typeorm';

export class BaseService<T extends ObjectLiteral> {
  constructor(
    private readonly repository: Repository<T>,
    ...args: any[]
  ) {}

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }
}
