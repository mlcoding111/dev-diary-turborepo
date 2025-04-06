import { Injectable } from '@nestjs/common';
import { BaseService } from '@/core/utils/service/base.service';
import { User } from '@/entities/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }
}
