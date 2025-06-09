import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { IBaseEntity } from '@/core/entity/base.entity';
import { User } from './user.entity';
import {
  GitProviderType,
  type TIntegrationData,
} from '@repo/types/integrations';

@Entity()
export class Integration implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Integration belong to a user
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  // Integration type
  @Column({ type: 'enum', enum: GitProviderType })
  type: GitProviderType;

  // Integration data
  @Column({ type: 'jsonb' })
  data: TIntegrationData;

  constructor(partial: Partial<Integration>) {
    Object.assign(this, partial);
  }
}

export type IntegrationType = InstanceType<typeof Integration>;
