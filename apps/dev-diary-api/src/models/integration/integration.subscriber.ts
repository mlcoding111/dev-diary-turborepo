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
import { Integration } from '@/entities/integration.entity';
import {
  AfterQueryEvent,
  BeforeQueryEvent,
} from 'typeorm/subscriber/event/QueryEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';

@EventSubscriber()
export class IntegrationSubscriber
  implements EntitySubscriberInterface<Integration>
{
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Integration;
  }

  afterLoad(entity: Integration) {
    this.eventEmitter.emit('entity.afterLoad.integration', entity);
  }

  beforeQuery(event: BeforeQueryEvent<Integration>) {
    this.eventEmitter.emit('entity.beforeQuery.integration', event);
  }

  afterQuery(event: AfterQueryEvent<Integration>) {
    this.eventEmitter.emit('entity.afterQuery.integration', event);
  }

  beforeInsert(event: InsertEvent<Integration>) {
    this.eventEmitter.emit('entity.beforeInsert.integration', event);
  }

  afterInsert(event: InsertEvent<Integration>) {
    this.eventEmitter.emit('entity.afterInsert.integration', event);
  }

  beforeUpdate(event: UpdateEvent<Integration>) {
    this.eventEmitter.emit('entity.beforeUpdate.integration', event);
  }

  afterUpdate(event: UpdateEvent<Integration>) {
    this.eventEmitter.emit('entity.afterUpdate.integration', event);
  }

  beforeRemove(event: RemoveEvent<Integration>) {
    this.eventEmitter.emit('entity.beforeRemove.integration', event);
  }

  afterRemove(event: RemoveEvent<Integration>) {
    this.eventEmitter.emit('entity.afterRemove.integration', event);
  }

  beforeSoftRemove(event: SoftRemoveEvent<Integration>) {
    this.eventEmitter.emit('entity.beforeSoftRemove.integration', event);
  }

  afterSoftRemove(event: SoftRemoveEvent<Integration>) {
    this.eventEmitter.emit('entity.afterSoftRemove.integration', event);
  }

  beforeRecover(event: RecoverEvent<Integration>) {
    this.eventEmitter.emit('entity.beforeRecover.integration', event);
  }

  afterRecover(event: RecoverEvent<Integration>) {
    this.eventEmitter.emit('entity.afterRecover.integration', event);
  }

  beforeTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.beforeTransactionStart.integration', event);
  }

  afterTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.afterTransactionStart.integration', event);
  }

  beforeTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.beforeTransactionCommit.integration', event);
  }

  afterTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.afterTransactionCommit.integration', event);
  }

  beforeTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit(
      'entity.beforeTransactionRollback.integration',
      event,
    );
  }

  afterTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit(
      'entity.afterTransactionRollback.integration',
      event,
    );
  }
}
