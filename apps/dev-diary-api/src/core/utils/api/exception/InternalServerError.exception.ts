import { InternalServerErrorException } from '@nestjs/common';

export type TExceptionError = {
  status_code: number;
  error_code: string;
  message: string;
  meta_data?: Record<string, any>;
};

export class InternalServerError extends InternalServerErrorException {
  private readonly error_code: string;
  private meta_data: Record<string, any>;

  constructor({
    message = 'A',
    status_code = 500,
    error_code = 'INTERNAL_SERVER_ERROR',
    meta_data = {},
  }: TExceptionError) {
    super({
      message,
      status_code,
      error_code,
    });

    this.error_code = error_code;
    this.meta_data = meta_data;
  }
}
