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
import { User } from '../entities/user.entity';
import {
  AfterQueryEvent,
  BeforeQueryEvent,
} from 'typeorm/subscriber/event/QueryEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    dataSource.subscribers.push(this);
  }

  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo() {
    return User;
  }

  /**
   * Called after entity is loaded.
   */
  afterLoad(entity: User) {
    console.log('afterLoad');
    this.eventEmitter.emit('entity.afterLoad.user', entity);
  }

  /**
   * Called before query execution.
   */
  beforeQuery(event: BeforeQueryEvent<User>) {
    this.eventEmitter.emit('entity.beforeQuery.user', event);
  }

  /**
   * Called after query execution.
   */
  afterQuery(event: AfterQueryEvent<User>) {
    console.log('afterQuery');
    this.eventEmitter.emit('entity.afterQuery.user', event);
  }

  /**
   * Called before entity insertion.
   */
  beforeInsert(event: InsertEvent<User>) {
    this.eventEmitter.emit('entity.beforeInsert.user', event);
  }

  /**
   * Called after entity insertion.
   */
  afterInsert(event: InsertEvent<User>) {
    this.eventEmitter.emit('entity.afterInsert.user', event);
  }

  /**
   * Called before entity update.
   */
  beforeUpdate(event: UpdateEvent<User>) {
    this.eventEmitter.emit('entity.beforeUpdate.user', event);
  }

  /**
   * Called after entity update.
   */
  afterUpdate(event: UpdateEvent<User>) {
    this.eventEmitter.emit('entity.afterUpdate.user', event);
  }

  /**
   * Called before entity removal.
   */
  beforeRemove(event: RemoveEvent<User>) {
    this.eventEmitter.emit('entity.beforeRemove.user', event);
  }

  /**
   * Called after entity removal.
   */
  afterRemove(event: RemoveEvent<User>) {
    this.eventEmitter.emit('entity.afterRemove.user', event);
  }

  /**
   * Called before entity removal.
   */
  beforeSoftRemove(event: SoftRemoveEvent<User>) {
    this.eventEmitter.emit('entity.beforeSoftRemove.user', event);
  }

  /**
   * Called after entity removal.
   */
  afterSoftRemove(event: SoftRemoveEvent<User>) {
    this.eventEmitter.emit('entity.afterSoftRemove.user', event);
  }

  /**
   * Called before entity recovery.
   */
  beforeRecover(event: RecoverEvent<User>) {
    this.eventEmitter.emit('entity.beforeRecover.user', event);
  }

  /**
   * Called after entity recovery.
   */
  afterRecover(event: RecoverEvent<User>) {
    this.eventEmitter.emit('entity.afterRecover.user', event);
  }

  /**
   * Called before transaction start.
   */
  beforeTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.beforeTransactionStart.user', event);
  }

  /**
   * Called after transaction start.
   */
  afterTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.afterTransactionStart.user', event);
  }

  /**
   * Called before transaction commit.
   */
  beforeTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.beforeTransactionCommit.user', event);
  }

  /**
   * Called after transaction commit.
   */
  afterTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.afterTransactionCommit.user', event);
  }

  /**
   * Called before transaction rollback.
   */
  beforeTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit('entity.beforeTransactionRollback.user', event);
  }

  /**
   * Called after transaction rollback.
   */
  afterTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit('entity.afterTransactionRollback.user', event);
  }
}
