import { HttpException } from '@nestjs/common';

export type TExceptionError = {
  status_code: number;
  error_code: string;
  message: string;
  meta_data?: Record<string, any>;
};

export class ApiException extends HttpException {
  private readonly error_code: string;
  private meta_data: Record<string, any>;

  constructor({
    message = '',
    status_code,
    error_code,
    meta_data = {},
  }: TExceptionError) {
    super(
      {
        message,
        status_code,
        error_code,
      },
      status_code,
    );

    this.error_code = error_code;
    this.meta_data = meta_data;
  }
}
