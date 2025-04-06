import { Repository } from 'typeorm';
import { Me } from '../../entities/me.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../core/utils/repository/base.repository';

@Injectable()
export class MeRepository extends BaseRepository<Me> {
  constructor(
    @InjectRepository(Me) private readonly meRepository: Repository<Me>,
  ) {
    super(meRepository);
  }
}
