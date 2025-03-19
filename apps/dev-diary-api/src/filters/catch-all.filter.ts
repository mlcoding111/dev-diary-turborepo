import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { TApiResponse } from '@repo/types/api';
import { ApiException } from '../core/utils/api/exception/ApiError.exception';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const errorIsHttpException =
      exception instanceof HttpException || exception instanceof ApiException;

    const errorIsInternalServerError =
      exception instanceof InternalServerErrorException;

    // get the instance of exception
    const exceptionInstance =
      errorIsHttpException || errorIsInternalServerError
        ? exception
        : new InternalServerErrorException();

    console.log('Exception instance', exceptionInstance.getResponse());

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      status_code: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
