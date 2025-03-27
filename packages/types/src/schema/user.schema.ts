import { z } from 'zod';

// import {
//     Entity,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//   } from 'typeorm';
//   import { Exclude } from 'class-transformer';
  
//   @Entity()
//   export class User {
//     @PrimaryGeneratedColumn()
//     id: number;
  
//     @Column()
//     first_name: string;
  
//     @Column()
//     last_name: string;
  
//     @Column()
//     email: string;
  
//     @Column()
//     @Exclude()
//     password: string;
  
//     @Column({ nullable: true })
//     @Exclude()
//     hashed_refresh_token: string;
  
//     @Column({ nullable: true })
//     refresh_token: string;
  
//     @CreateDateColumn()
//     created_at: Date;
  
//     @UpdateDateColumn()
//     updated_at: Date;
  
//     constructor(partial: Partial<User>) {
//       Object.assign(this, partial);
//     }
//   }
  
//   export type UserSerialized = Omit<
//     User,
//     'password' | 'hashed_refresh_token' | 'refresh_token'
//   >;
  

const userSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  password: z.string(),
  hashed_refresh_token: z.string().nullable(),
  refresh_token: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const userSchemaSerialized = userSchema.omit({
  password: true,
  hashed_refresh_token: true,
  refresh_token: true,
}).strict();

export const createUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).strict();

export type TUser = z.infer<typeof userSchema>;
export type TCreateUser = Omit<z.infer<typeof userSchema>, 'id' | 'created_at' | 'updated_at'>;
export type TSerializedUser = Omit<z.infer<typeof userSchema>, 'password' | 'hashed_refresh_token' | 'refresh_token'>;


