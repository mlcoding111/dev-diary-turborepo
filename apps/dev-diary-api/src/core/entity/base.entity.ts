import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectLiteral,
} from 'typeorm';

@Entity()
export class BaseEntity<T extends ObjectLiteral> {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}

export type BaseEntityType<T extends ObjectLiteral> = InstanceType<
  typeof BaseEntity<T>
>;
