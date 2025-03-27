type EntityEvents<T> = 
  | `entity.afterLoad.${string}`
  | `entity.beforeQuery.${string}`
  | `entity.afterQuery.${string}`
  | `entity.beforeInsert.${string}`
  | `entity.afterInsert.${string}`
  | `entity.beforeUpdate.${string}`
  | `entity.afterUpdate.${string}`
  | `entity.beforeRemove.${string}`
  | `entity.afterRemove.${string}`
  | `entity.beforeSoftRemove.${string}`
  | `entity.afterSoftRemove.${string}`
  | `entity.beforeRecover.${string}`
  | `entity.afterRecover.${string}`
  | `entity.beforeTransactionStart.${string}`
  | `entity.afterTransactionStart.${string}`
  | `entity.beforeTransactionCommit.${string}`
  | `entity.afterTransactionCommit.${string}`
  | `entity.beforeTransactionRollback.${string}`
  | `entity.afterTransactionRollback.${string}`;

type EventPayload = object; // More specific typing if needed

export type { EntityEvents, EventPayload };
