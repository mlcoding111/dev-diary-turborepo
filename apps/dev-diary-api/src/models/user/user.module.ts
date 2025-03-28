import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserSubscriber } from './user.subscriber';
import { UserListener } from './user.listener';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    UserRepository,
    UserSubscriber,
    UserListener,
    JwtService,
  ],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
