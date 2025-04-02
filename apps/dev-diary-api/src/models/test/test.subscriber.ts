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
import { Test } from '@/entities/test.entity';
import {
  AfterQueryEvent,
  BeforeQueryEvent,
} from 'typeorm/subscriber/event/QueryEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';

@EventSubscriber()
export class TestSubscriber implements EntitySubscriberInterface<Test> {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Test;
  }

  afterLoad(entity: Test) {
    this.eventEmitter.emit('entity.afterLoad.test', entity);
  }

  beforeQuery(event: BeforeQueryEvent<Test>) {
    this.eventEmitter.emit('entity.beforeQuery.test', event);
  }

  afterQuery(event: AfterQueryEvent<Test>) {
    this.eventEmitter.emit('entity.afterQuery.test', event);
  }

  beforeInsert(event: InsertEvent<Test>) {
    this.eventEmitter.emit('entity.beforeInsert.test', event);
  }

  afterInsert(event: InsertEvent<Test>) {
    this.eventEmitter.emit('entity.afterInsert.test', event);
  }

  beforeUpdate(event: UpdateEvent<Test>) {
    this.eventEmitter.emit('entity.beforeUpdate.test', event);
  }

  afterUpdate(event: UpdateEvent<Test>) {
    this.eventEmitter.emit('entity.afterUpdate.test', event);
  }

  beforeRemove(event: RemoveEvent<Test>) {
    this.eventEmitter.emit('entity.beforeRemove.test', event);
  }

  afterRemove(event: RemoveEvent<Test>) {
    this.eventEmitter.emit('entity.afterRemove.test', event);
  }

  beforeSoftRemove(event: SoftRemoveEvent<Test>) {
    this.eventEmitter.emit('entity.beforeSoftRemove.test', event);
  }

  afterSoftRemove(event: SoftRemoveEvent<Test>) {
    this.eventEmitter.emit('entity.afterSoftRemove.test', event);
  }

  beforeRecover(event: RecoverEvent<Test>) {
    this.eventEmitter.emit('entity.beforeRecover.test', event);
  }

  afterRecover(event: RecoverEvent<Test>) {
    this.eventEmitter.emit('entity.afterRecover.test', event);
  }

  beforeTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.beforeTransactionStart.test', event);
  }

  afterTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.afterTransactionStart.test', event);
  }

  beforeTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.beforeTransactionCommit.test', event);
  }

  afterTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.afterTransactionCommit.test', event);
  }

  beforeTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit('entity.beforeTransactionRollback.test', event);
  }

  afterTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit('entity.afterTransactionRollback.test', event);
  }
}
