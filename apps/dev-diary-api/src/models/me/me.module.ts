import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Me } from '../../entities/me.entity';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { MeRepository } from './me.repository';
import { MeSubscriber } from './me.subscriber';
import { MeListener } from './me.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Me])],
  providers: [MeService, MeRepository, MeSubscriber, MeListener],
  controllers: [MeController],
  exports: [MeService, MeRepository],
})
export class MeModule {}
