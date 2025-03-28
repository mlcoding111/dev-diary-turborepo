import { SetMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';
// You can make the Validate decorator generic to accept a type parameter
export const VALIDATION_SCHEMA = 'validation_schema';

// Modify the decorator to accept a generic parameter for type inference
export const Validate = ({
  output,
  input,
  bypass,
}: {
  output?: ZodSchema<unknown>;
  input?: ZodSchema<unknown>;
  bypass?: boolean;
}) =>
  SetMetadata(VALIDATION_SCHEMA, {
    output,
    input,
    bypass,
  });
