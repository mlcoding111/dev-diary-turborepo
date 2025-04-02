import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBaseEntity } from '@/core/entity/base.entity';
@Entity()
export class Project implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  slug: string;

  // @ManyToOne(() => User, (user) => user.projects)
  // user: User;

  // @OneToMany(() => Session, (session) => session.project)
  // sessions: Session[];
}

export type ProjectType = InstanceType<typeof Project>;
