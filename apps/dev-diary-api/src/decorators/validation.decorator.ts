import { SetMetadata } from '@nestjs/common';
import { ZodSchema, ZodObject } from 'zod';

export const VALIDATION_SCHEMA = 'validation_schema';

export const Validate = ({
  output,
  input,
}: {
  output?: ZodSchema | ZodObject<any, any>;
  input?: ZodSchema | ZodObject<any, any>;
}) =>
  SetMetadata(VALIDATION_SCHEMA, {
    output,
    input,
  });
