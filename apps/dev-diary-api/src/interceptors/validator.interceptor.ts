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

const methodIsPostPutOrPatch = (method: string) =>
  method === 'POST' || method === 'PUT' || method === 'PATCH';

@Injectable()
export class GlobalValidationInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const schema = this.reflector.get<validationPayload>(
      VALIDATION_SCHEMA,
      context.getHandler(),
    );

    // Get request type
    const request: Request = context.switchToHttp().getRequest();
    const { method, url } = request;

    console.log(`Validating: ${method} ${url}`);
    // todo: add custom error class
    if (method === 'GET' && !schema?.output) {
      throw new BadRequestException({
        message: 'Output schema is required for GET requests',
      });
    }

    // todo: add custom error class
    if (methodIsPostPutOrPatch(method) && !schema?.input) {
      throw new BadRequestException({
        message: 'Input schema is required for POST requests',
      });
    }

    if (!schema) return next.handle();

    return next.handle().pipe(
      map((data) => {
        // Validate input and output if provided
        if (schema.input) {
          const result = schema.input.safeParse(data);
          if (!result.success) {
            throw new BadRequestException({
              message: 'Request data input validation failed',
              issues: result.error.flatten(),
            });
          }
        }

        // If output parsing is not a success, either return a detailed error.
        // But, if the output is not matching the expected schema, we should simply return an error to avoid leaking sensitive information.
        // Todo: add custom error class
        if (schema.output) {
          const result = schema.output.safeParse(data);
          if (!result.success) {
            throw new Error('Response data output validation failed');
            // throw new BadRequestException({
            //   message: 'Response data output validation failed',
            //   issues: result.error.flatten(),
            // });
          }
        }

        // @lint-ignore: no-unsafe-return
        return data;
      }),
    );
  }
}
