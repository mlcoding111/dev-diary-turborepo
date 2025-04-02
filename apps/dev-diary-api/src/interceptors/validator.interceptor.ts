import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZodSchema } from 'zod';
import { VALIDATION_SCHEMA } from '../decorators/validation.decorator';
import { ApiException } from 'src/core/utils/api/exception/ApiError.exception';
import { paginationSchema } from '@repo/types/schema';

// Define the structure for validation schemas
type validationPayload = {
  output?: ZodSchema; // Schema for validating response data
  input?: ZodSchema; // Schema for validating request data
  bypass?: boolean;
  pagination?: boolean;
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
    const { method, url, body } = request;
    console.log(`Validating: ${method} ${url}`);

    if (!schema?.bypass) {
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
    }

    // Skip validation if no schema is provided
    if (!schema || schema.bypass) return next.handle();

    if (schema.input) {
      // get the schema
      const result = schema.input.safeParse(body);
      if (!result.success) {
        throw new ApiException({
          message: `Request data input validation failed for: ${url}`,
          data: result.error.flatten(),
          status_code: 400,
          error_code: 'VALIDATION_ERROR',
        });
      }
    }

    return next.handle().pipe(
      map((data) => {
        const dataToValidate = schema.pagination ? data.data : data;
        if (schema.pagination) {
          const result = paginationSchema.safeParse(data.metadata);
          if (!result.success) {
            throw new ApiException({
              message: `Metadata validation failed for: ${url}`,
              data: result.error.flatten(),
              error_code: 'VALIDATION_ERROR',
              status_code: HttpStatus.BAD_REQUEST,
            });
          }
        }
        // Validate response data if output schema exists
        if (schema.output) {
          const result = schema.output.safeParse(dataToValidate);
          if (!result.success) {
            throw new ApiException({
              message: `Response data output validation failed for: ${url}`,
              data: result?.error?.format(),
              status_code: HttpStatus.BAD_REQUEST,
              error_code: 'VALIDATION_ERROR',
            });
          }
        }

        return data as unknown;
      }),
    );
  }
}
