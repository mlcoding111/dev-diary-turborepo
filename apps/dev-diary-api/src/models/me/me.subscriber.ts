import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RecoverEvent,
  RemoveEvent,
  SoftRemoveEvent,
  TransactionCommitEvent,
  TransactionRollbackEvent,
  TransactionStartEvent,
  UpdateEvent,
} from 'typeorm';
import { Me } from '@/entities/me.entity';
import {
  AfterQueryEvent,
  BeforeQueryEvent,
} from 'typeorm/subscriber/event/QueryEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';

@EventSubscriber()
export class MeSubscriber implements EntitySubscriberInterface<Me> {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Me;
  }

  afterLoad(entity: Me) {
    this.eventEmitter.emit('entity.afterLoad.me', entity);
  }

  beforeQuery(event: BeforeQueryEvent<Me>) {
    this.eventEmitter.emit('entity.beforeQuery.me', event);
  }

  afterQuery(event: AfterQueryEvent<Me>) {
    this.eventEmitter.emit('entity.afterQuery.me', event);
  }

  beforeInsert(event: InsertEvent<Me>) {
    this.eventEmitter.emit('entity.beforeInsert.me', event);
  }

  afterInsert(event: InsertEvent<Me>) {
    this.eventEmitter.emit('entity.afterInsert.me', event);
  }

  beforeUpdate(event: UpdateEvent<Me>) {
    this.eventEmitter.emit('entity.beforeUpdate.me', event);
  }

  afterUpdate(event: UpdateEvent<Me>) {
    this.eventEmitter.emit('entity.afterUpdate.me', event);
  }

  beforeRemove(event: RemoveEvent<Me>) {
    this.eventEmitter.emit('entity.beforeRemove.me', event);
  }

  afterRemove(event: RemoveEvent<Me>) {
    this.eventEmitter.emit('entity.afterRemove.me', event);
  }

  beforeSoftRemove(event: SoftRemoveEvent<Me>) {
    this.eventEmitter.emit('entity.beforeSoftRemove.me', event);
  }

  afterSoftRemove(event: SoftRemoveEvent<Me>) {
    this.eventEmitter.emit('entity.afterSoftRemove.me', event);
  }

  beforeRecover(event: RecoverEvent<Me>) {
    this.eventEmitter.emit('entity.beforeRecover.me', event);
  }

  afterRecover(event: RecoverEvent<Me>) {
    this.eventEmitter.emit('entity.afterRecover.me', event);
  }

  beforeTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.beforeTransactionStart.me', event);
  }

  afterTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.afterTransactionStart.me', event);
  }

  beforeTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.beforeTransactionCommit.me', event);
  }

  afterTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.afterTransactionCommit.me', event);
  }

  beforeTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit('entity.beforeTransactionRollback.me', event);
  }

  afterTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit('entity.afterTransactionRollback.me', event);
  }
}
