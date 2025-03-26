import { HttpException } from '@nestjs/common';

export const formatHttpException = (exception: HttpException) => {
  return {
    success: false,
    message: exception.message,
    status_code: exception.getStatus(),
    timestamp: new Date().toISOString(),

    error_code: 'HTTP_EXCEPTION',
  };
};