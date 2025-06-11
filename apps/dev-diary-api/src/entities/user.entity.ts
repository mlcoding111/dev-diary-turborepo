import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';
import { IBaseEntity } from '@/core/entity/base.entity';
import { Integration } from './integration.entity';
import { TSerializedUser } from '@repo/types/schema';

@Entity()
export class User implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  hashed_refresh_token: string | null;

  @Column({ type: 'varchar', nullable: true })
  refresh_token: string | null;

  @Column({ type: 'varchar', nullable: true })
  access_token: string | null;

  @Column({ name: 'active_integration_id', nullable: true, type: 'uuid' })
  active_integration_id: string | null;

  @Exclude()
  @ManyToOne(() => Integration)
  @JoinColumn({ name: 'active_integration_id' })
  active_integration: Integration;

  @Exclude()
  @OneToMany(() => Integration, (integration) => integration.user)
  integrations: Integration[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export class LoginOutput {
  user: TSerializedUser;
  access_token: string;
  refresh_token: string;

  constructor(user: User, access_token: string, refresh_token: string) {
    // 👇 Ensure user is serialized and typed correctly
    this.user = instanceToPlain(user, {
      enableImplicitConversion: true,
    }) as TSerializedUser;

    this.access_token = access_token;
    this.refresh_token = refresh_token;
  }
}
export type UserType = InstanceType<typeof User>;

// Make sure it satisfies the TCreateUserType
export type TCreateUser = Partial<
  Omit<User, 'id' | 'created_at' | 'updated_at'>
>;
