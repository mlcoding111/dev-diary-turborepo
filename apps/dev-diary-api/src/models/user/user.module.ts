import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserSubscriber } from './user.subscriber';
import { UserListener } from './user.listener';
import { GithubService } from '@/modules/github/github.service';
import { GitResolverService } from '@/modules/git/git-resolver.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    UserRepository,
    UserSubscriber,
    UserListener,
    JwtService,
    GithubService,
    GitResolverService,
  ],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
