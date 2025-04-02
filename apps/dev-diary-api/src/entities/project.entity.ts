import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@/core/entity/base.entity';
import { User } from './user.entity';
// import { Session } from './session.entity';

@Entity()
export class Project extends BaseEntity<Project> {
  @Column()
  name: string;

  @Column()
  slug: string;

  // @ManyToOne(() => User, (user) => user.projects)
  // user: User;

  // @OneToMany(() => Session, (session) => session.project)
  // sessions: Session[];
}

export type ProjectType = InstanceType<typeof Project>;
