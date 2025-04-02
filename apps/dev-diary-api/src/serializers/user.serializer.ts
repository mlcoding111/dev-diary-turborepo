// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Exclude } from 'class-transformer';
// import { IBaseEntity } from '@/core/entity/base.entity';
// import type { User, UserType } from '@/entities/user.entity';

// export class UserSerializer implements UserType {
//   id: string;
//   created_at: Date;
//   updated_at: Date;
//   first_name: string;
//   last_name: string;
//   email: string;

//   @Exclude()
//   password: string;

//   @Exclude()
//   hashed_refresh_token: string | null;

//   @Exclude()
//   refresh_token: string | null;

//   constructor(partial: User) {
//     Object.assign(this, partial);
//   }
// }
