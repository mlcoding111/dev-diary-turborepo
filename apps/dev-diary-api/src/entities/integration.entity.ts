import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { IBaseEntity } from '@/core/entity/base.entity';
import { User } from './user.entity';
import { OAuthProviderType } from '@/types/auth';

@Entity()
export class Integration implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ name: 'access_token' })
  access_token: string;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refresh_token?: string | null;

  @ManyToOne(() => User, (user) => user.integrations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Integration type
  @Column({ type: 'enum', enum: OAuthProviderType })
  provider: OAuthProviderType;

  // Integration data
  @Column({ type: 'jsonb' })
  data: any;

  constructor(partial: Partial<Integration>) {
    Object.assign(this, partial);
  }
}

export type IntegrationType = InstanceType<typeof Integration>;
