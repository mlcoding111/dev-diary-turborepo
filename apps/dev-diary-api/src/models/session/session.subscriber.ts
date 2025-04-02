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
import { Session } from '@/entities/session.entity';
import {
  AfterQueryEvent,
  BeforeQueryEvent,
} from 'typeorm/subscriber/event/QueryEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';

@EventSubscriber()
export class SessionSubscriber implements EntitySubscriberInterface<Session> {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Session;
  }

  afterLoad(entity: Session) {
    this.eventEmitter.emit('entity.afterLoad.session', entity);
  }

  beforeQuery(event: BeforeQueryEvent<Session>) {
    this.eventEmitter.emit('entity.beforeQuery.session', event);
  }

  afterQuery(event: AfterQueryEvent<Session>) {
    this.eventEmitter.emit('entity.afterQuery.session', event);
  }

  beforeInsert(event: InsertEvent<Session>) {
    this.eventEmitter.emit('entity.beforeInsert.session', event);
  }

  afterInsert(event: InsertEvent<Session>) {
    this.eventEmitter.emit('entity.afterInsert.session', event);
  }

  beforeUpdate(event: UpdateEvent<Session>) {
    this.eventEmitter.emit('entity.beforeUpdate.session', event);
  }

  afterUpdate(event: UpdateEvent<Session>) {
    this.eventEmitter.emit('entity.afterUpdate.session', event);
  }

  beforeRemove(event: RemoveEvent<Session>) {
    this.eventEmitter.emit('entity.beforeRemove.session', event);
  }

  afterRemove(event: RemoveEvent<Session>) {
    this.eventEmitter.emit('entity.afterRemove.session', event);
  }

  beforeSoftRemove(event: SoftRemoveEvent<Session>) {
    this.eventEmitter.emit('entity.beforeSoftRemove.session', event);
  }

  afterSoftRemove(event: SoftRemoveEvent<Session>) {
    this.eventEmitter.emit('entity.afterSoftRemove.session', event);
  }

  beforeRecover(event: RecoverEvent<Session>) {
    this.eventEmitter.emit('entity.beforeRecover.session', event);
  }

  afterRecover(event: RecoverEvent<Session>) {
    this.eventEmitter.emit('entity.afterRecover.session', event);
  }

  beforeTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.beforeTransactionStart.session', event);
  }

  afterTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.afterTransactionStart.session', event);
  }

  beforeTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.beforeTransactionCommit.session', event);
  }

  afterTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.afterTransactionCommit.session', event);
  }

  beforeTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit('entity.beforeTransactionRollback.session', event);
  }

  afterTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit('entity.afterTransactionRollback.session', event);
  }
}
