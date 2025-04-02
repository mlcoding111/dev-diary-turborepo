import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '../../entities/test.entity';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TestRepository } from './test.repository';
import { TestSubscriber } from './test.subscriber';
import { TestListener } from './test.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  providers: [TestService, TestRepository, TestSubscriber, TestListener],
  controllers: [TestController],
  exports: [TestService, TestRepository],
})
export class TestModule {}
