import { ClsStore } from 'nestjs-cls';
import { TSerializedUser } from '@repo/types/schema';

export interface IClsStore extends ClsStore {
  user: TSerializedUser;
}
