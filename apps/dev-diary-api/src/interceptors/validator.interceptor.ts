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
import { ValidationError } from '../core/utils/api/exception/ValidationError.exception';
import { ApiException } from 'src/core/utils/api/exception/ApiError.exception';

// Define the structure for validation schemas
type validationPayload = {
  output?: ZodSchema; // Schema for validating response data
  input?: ZodSchema; // Schema for validating request data
};

// Helper function to check if the HTTP method requires input validation
const methodIsPostPutOrPatch = (method: string) =>
  method === 'POST' || method === 'PUT' || method === 'PATCH';

@Injectable()
export class GlobalValidationInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Get validation schemas from route handler metadata
    const schema = this.reflector.get<validationPayload>(
      VALIDATION_SCHEMA,
      context.getHandler(),
    );

    // Extract request details for validation
    const request: Request = context.switchToHttp().getRequest();
    const { method, url } = request;

    console.log(`Validating: ${method} ${url}`);

    // Ensure GET requests have output validation
    if (method === 'GET' && !schema?.output) {
      throw new Error('Output schema is required for GET requests');
    }

    // Ensure POST/PUT/PATCH requests have input validation
    if (methodIsPostPutOrPatch(method) && !schema?.input) {
      throw new Error(
        'Input schema is required for POST, PUT, and PATCH requests',
      );
    }

    // Skip validation if no schema is provided
    if (!schema) return next.handle();

    return next.handle().pipe(
      map((data) => {
        // Validate request data if input schema exists
        if (schema.input) {
          const result = schema.input.safeParse(data);
          console.log(result.error);
          console.log('data', data);
          if (!result.success) {
            throw new ValidationError({
              message: 'Request data input validation failed',
              fields: result.error.flatten(),
              data: null,
              status_code: 400,
              error_code: 'VALIDATION_ERROR',
            });
          }
        }

        // Validate response data if output schema exists
        if (schema.output) {
          const result = schema.output.safeParse(data);
          console.log('This is the data', data);
          console.log('This is the error', result?.error?.format());
          if (!result.success) {
            throw new ApiException({
              message: 'Response data output validation failed for:',
              data: result?.error?.format(),
              status_code: 400,
              error_code: 'VALIDATION_ERROR',
            });
          }
        }

        return data as unknown;
      }),
    );
  }
}
