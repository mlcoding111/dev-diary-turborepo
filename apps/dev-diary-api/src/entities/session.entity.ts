import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBaseEntity } from '@/core/entity/base.entity';

@Entity()
export class Session implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(partial: Partial<Session>) {
    Object.assign(this, partial);
  }
}

export type SessionType = InstanceType<typeof Session>;
