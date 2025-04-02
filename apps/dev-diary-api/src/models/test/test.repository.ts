import { Repository } from 'typeorm';
import { Test } from '../../entities/test.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../core/utils/repository/base.repository';

@Injectable()
export class TestRepository extends BaseRepository<Test> {
  constructor(
    @InjectRepository(Test) private readonly testRepository: Repository<Test>,
  ) {
    super(testRepository);
  }
}
