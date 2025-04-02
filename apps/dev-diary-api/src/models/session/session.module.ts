import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../../entities/session.entity';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { SessionSubscriber } from './session.subscriber';
import { SessionListener } from './session.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [
    SessionService,
    SessionRepository,
    SessionSubscriber,
    SessionListener,
  ],
  controllers: [SessionController],
  exports: [SessionService, SessionRepository],
})
export class SessionModule {}
