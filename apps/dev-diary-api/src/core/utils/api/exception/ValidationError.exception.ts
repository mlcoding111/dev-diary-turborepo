import {
  TExceptionErrorPayload,
  TExceptionErrorResponse,
} from '@repo/types/api';
import { ApiException } from './ApiError.exception';

interface TExceptionErrorWithFieldsPayload extends TExceptionErrorPayload {
  fields?: Record<string, any>;
}

export class ValidationError
  extends ApiException
  implements TExceptionErrorResponse
{
  readonly fields: Record<string, any>;

  constructor({
    message = '',
    error_code,
    status_code,
    metadata = {},
    fields = {},
  }: TExceptionErrorWithFieldsPayload) {
    super({ message, error_code, status_code, metadata, data: null });

    this.fields = fields;
  }
}
