import { ClsService } from 'nestjs-cls';
import { IClsStore } from '@/types/request-context';

export class RequestContextService extends ClsService<IClsStore> {}
