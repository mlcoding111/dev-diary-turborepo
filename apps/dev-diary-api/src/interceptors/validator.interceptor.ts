import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZodSchema } from 'zod';
import { VALIDATION_SCHEMA } from '../decorators/validation.decorator';

type validationPayload = {
  output?: ZodSchema;
  input?: ZodSchema;
};
@Injectable()
export class GlobalValidationInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const schema = this.reflector.get<validationPayload>(
      VALIDATION_SCHEMA,
      context.getHandler(),
    );

    console.log('Validator');

    // Get request type
    const request: Request = context.switchToHttp().getRequest();
    const { method, url } = request;

    if (method === 'GET' && !schema?.output) {
      throw new BadRequestException({
        message: 'Response data validation failed',
      });
    }

    if (method === 'POST' && !schema.input) {
      throw new BadRequestException({
        message: 'Request data validation failed',
      });
    }

    console.log(`${method} ${url}`);
    if (!schema) return next.handle();

    return next.handle().pipe(
      map((data) => {
        // Validate input and output if provided
        if (schema.input) {
          const result = schema.input.safeParse(data);
          if (!result.success) {
            throw new BadRequestException({
              message: 'Request data input validation failed',
              issues: result.error.format(),
            });
          }
        }

        if (schema.output) {
          const result = schema.output.safeParse(data);
          if (!result.success) {
            throw new BadRequestException({
              message: 'Response data output validation failed',
              issues: result.error.format(),
            });
          }
        }

        return data;
      }),
    );
  }
}
