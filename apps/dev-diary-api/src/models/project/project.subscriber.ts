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
import { Project } from '@/entities/project.entity';
import {
  AfterQueryEvent,
  BeforeQueryEvent,
} from 'typeorm/subscriber/event/QueryEvent';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';

@EventSubscriber()
export class ProjectSubscriber implements EntitySubscriberInterface<Project> {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Project;
  }

  afterLoad(entity: Project) {
    this.eventEmitter.emit('entity.afterLoad.project', entity);
  }

  beforeQuery(event: BeforeQueryEvent<Project>) {
    this.eventEmitter.emit('entity.beforeQuery.project', event);
  }

  afterQuery(event: AfterQueryEvent<Project>) {
    this.eventEmitter.emit('entity.afterQuery.project', event);
  }

  beforeInsert(event: InsertEvent<Project>) {
    this.eventEmitter.emit('entity.beforeInsert.project', event);
  }

  afterInsert(event: InsertEvent<Project>) {
    this.eventEmitter.emit('entity.afterInsert.project', event);
  }

  beforeUpdate(event: UpdateEvent<Project>) {
    this.eventEmitter.emit('entity.beforeUpdate.project', event);
  }

  afterUpdate(event: UpdateEvent<Project>) {
    this.eventEmitter.emit('entity.afterUpdate.project', event);
  }

  beforeRemove(event: RemoveEvent<Project>) {
    this.eventEmitter.emit('entity.beforeRemove.project', event);
  }

  afterRemove(event: RemoveEvent<Project>) {
    this.eventEmitter.emit('entity.afterRemove.project', event);
  }

  beforeSoftRemove(event: SoftRemoveEvent<Project>) {
    this.eventEmitter.emit('entity.beforeSoftRemove.project', event);
  }

  afterSoftRemove(event: SoftRemoveEvent<Project>) {
    this.eventEmitter.emit('entity.afterSoftRemove.project', event);
  }

  beforeRecover(event: RecoverEvent<Project>) {
    this.eventEmitter.emit('entity.beforeRecover.project', event);
  }

  afterRecover(event: RecoverEvent<Project>) {
    this.eventEmitter.emit('entity.afterRecover.project', event);
  }

  beforeTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.beforeTransactionStart.project', event);
  }

  afterTransactionStart(event: TransactionStartEvent) {
    this.eventEmitter.emit('entity.afterTransactionStart.project', event);
  }

  beforeTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.beforeTransactionCommit.project', event);
  }

  afterTransactionCommit(event: TransactionCommitEvent) {
    this.eventEmitter.emit('entity.afterTransactionCommit.project', event);
  }

  beforeTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit('entity.beforeTransactionRollback.project', event);
  }

  afterTransactionRollback(event: TransactionRollbackEvent) {
    this.eventEmitter.emit('entity.afterTransactionRollback.project', event);
  }
}
