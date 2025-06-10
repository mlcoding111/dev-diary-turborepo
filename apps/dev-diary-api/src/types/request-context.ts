import { ClsStore } from 'nestjs-cls';
import { TSerializedUser } from '@repo/types/schema';

export interface IClsStore extends ClsStore {
  user: TUserAuth;
}

export type TUserAuth = TSerializedUser & { sub?: string };
