import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBaseEntity } from '@/core/entity/base.entity';

@Entity()
export class Me implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(partial: Partial<Me>) {
    Object.assign(this, partial);
  }
}

export type MeType = InstanceType<typeof Me>;
