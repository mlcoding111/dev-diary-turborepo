import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiException } from '../core/utils/api/exception/ApiError.exception';
import { ValidationError } from 'src/core/utils/api/exception/ValidationError.exception';
import { TApiResponseError, TErrorDataType } from '@repo/types/api';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const status = exception.getStatus();

    console.log('HttpExceptionFilter');

    const isCustomException =
      exception instanceof ApiException || exception instanceof ValidationError;

    const responseBody: TApiResponseError = {
      success: false,
      message: exception.message,
      status_code: status,
      timestamp: new Date().toISOString(),
      error_code: isCustomException 
        ? (exception as ApiException).getErrorCode()
        : 'INTERNAL_SERVER_ERROR',
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      data: isCustomException ? (exception as ApiException).getData() : null,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
