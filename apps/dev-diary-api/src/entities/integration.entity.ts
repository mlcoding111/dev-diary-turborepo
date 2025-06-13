import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { IBaseEntity } from '@/core/entity/base.entity';
import { User } from './user.entity';
import { OAuthIntegrationType, OAuthProviderType } from '@/types/auth';
import { OAuthSettings } from '@/config/oauth.config';

@Entity()
export class Integration implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ name: 'last_synced_at', type: 'timestamp', nullable: true })
  last_synced_at?: Date | null;

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

  @Column({ name: 'type', type: 'enum', enum: OAuthIntegrationType })
  type: OAuthIntegrationType;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @Column({
    type: 'jsonb',
    default: () => `'${JSON.stringify(OAuthSettings)}'`,
  })
  settings: Record<string, any>;

  // ------------------------------------------------------------
  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  first_name?: string | null;

  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  last_name?: string | null;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email?: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', nullable: true })
  avatar_url?: string | null;

  @Column({ name: 'username', type: 'varchar', nullable: true })
  username?: string | null;

  @Column({ name: 'profile_url', type: 'varchar', nullable: true })
  profile_url?: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  is_active: boolean;

  @BeforeInsert()
  setSettings() {
    this.settings = OAuthSettings;
  }

  constructor(partial: Partial<Integration>) {
    Object.assign(this, partial);
  }
}

export type IntegrationType = InstanceType<typeof Integration>;
