import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiException } from '../core/utils/api/exception/ApiError.exception';
import { TExceptionErrorResponse } from '@repo/types/api';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const isHttpException = this.isHttpException(exception);
    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const isCustomException = this.isCustomException(exception);

    const responseBody: TExceptionErrorResponse = {
      success: false,
      message: this.getErrorMessage(exception) || 'Internal Server Error',
      status_code: httpStatus,
      timestamp: new Date().toISOString(),
      error_code: isCustomException
        ? (exception as ApiException).error_code
        : 'INTERNAL_SERVER_ERROR',
      path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
      stack: this.getStack(exception),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private isHttpException(exception: unknown): exception is HttpException {
    return (
      exception instanceof HttpException || exception instanceof ApiException
    );
  }

  private isCustomException(
    exception: unknown,
  ): exception is ApiException | InternalServerErrorException {
    return (
      exception instanceof ApiException ||
      exception instanceof InternalServerErrorException
    );
  }

  private getErrorMessage(exception: unknown): string {
    return exception instanceof Error || exception instanceof ApiException
      ? exception.message
      : 'Internal Server Error';
  }

  private getStack(exception: unknown): string | null | undefined {
    return exception instanceof ApiException || exception instanceof Error
      ? exception.stack
      : null;
  }
}
