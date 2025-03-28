import { ClsStore } from 'nestjs-cls';
import { User } from '@/entities/user.entity';

export interface IClsStore extends ClsStore {
  user: User;
}
