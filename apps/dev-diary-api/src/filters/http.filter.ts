import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiException } from '../core/utils/api/exception/ApiError.exception';
import { TApiResponseError } from '@repo/types/api';
import { Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const status = exception.getStatus();

    const isCustomException = exception instanceof ApiException;

    const responseBody: TApiResponseError = {
      success: false,
      message: exception.message,
      status_code: status,
      timestamp: new Date().toISOString(),
      error_code: isCustomException
        ? exception.getErrorCode()
        : 'UNKNOWN_ERROR',
      path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
      data: isCustomException ? exception.getData() : null,
    };
    Logger.error(exception.message, responseBody, responseBody.error_code);
    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
