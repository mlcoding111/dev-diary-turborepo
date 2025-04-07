'use server';

import {
    registerUserSchema,
  } from '@repo/types/schema';

export async function signup(state: FormState, formData: FormData) {
    const validationResult = registerUserSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });
    console.log(validationResult);
    if (!validationResult.success) {
        return { errors: validationResult.error.flatten().fieldErrors };
    }

    return {
        message: 'User created successfully',
    };

    console.log(validationResult.data);
}

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
