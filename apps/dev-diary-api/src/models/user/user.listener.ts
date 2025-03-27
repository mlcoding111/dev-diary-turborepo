import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from '../../entities/user.entity';
import type { AfterQueryEvent } from 'typeorm/subscriber/event/QueryEvent.js';

@Injectable()
export class UserListener {
  @OnEvent('entity.afterQuery.user')
  handleOrderCreatedEvent(event: AfterQueryEvent<User>) {
    // handle and process "OrderCreatedEvent" event
    console.log('User Query Result: ', event.success);
  }
}
