import { SetMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';

export const VALIDATION_SCHEMA = 'validation_schema';

export const Validate = ({
  output,
  input,
}: {
  output?: ZodSchema;
  input?: ZodSchema;
}) =>
  SetMetadata(VALIDATION_SCHEMA, {
    output,
    input,
  });
