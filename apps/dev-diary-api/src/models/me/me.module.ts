import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Me } from '../../entities/me.entity';
import { UserService } from './me.service';
import { MeController } from './me.controller';
import { UserRepository } from '../user/user.repository';
import { UserSubscriber } from '../user/user.subscriber';
import { UserListener } from '../user/user.listener';
import { User } from '@/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Me, User]), UserModule],
  providers: [UserService, UserRepository, UserSubscriber, UserListener],
  controllers: [MeController],
  exports: [UserService],
})
export class MeModule {}
