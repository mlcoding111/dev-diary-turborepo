import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../core/utils/repository/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  private instance: UserRepository;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
