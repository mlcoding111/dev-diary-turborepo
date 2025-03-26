import { HttpException, InternalServerErrorException } from '@nestjs/common';
import {
  TExceptionErrorPayload,
  TApiResponseError,
  TErrorDataType,
} from '@repo/types/api';
import { TErrorCode } from '@repo/types/error-codes';
import { ErrorCode } from '@repo/types/utils';

export class ApiException extends HttpException implements TApiResponseError {
  readonly success: false;
  readonly error_code: TErrorCode;
  readonly metadata: Record<string, any>;
  readonly status_code: number;
  readonly message: string;
  readonly timestamp: string;
  readonly data: TErrorDataType;
  readonly path: string;

  constructor({
    message = '',
    error_code,
    status_code,
    metadata = {},
    data = null,
  }: TExceptionErrorPayload) {
    super(
      {
        success: false,
        message,
        error_code,
        data: null,
        metadata,
      },
      status_code,
    );

    this.data = data ?? null;
    this.error_code = error_code;
    this.metadata = metadata ?? {};
    this.status_code = status_code;
    this.message = message || ErrorCode[error_code];
  }

  getStatus(): number {
    return this.status_code;
  }

  getErrorCode(): TErrorCode {
    return this.error_code;
  }

  getData(): TErrorDataType {
    return this.data;
  }
}

export class InternalServerError extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
  }
}
