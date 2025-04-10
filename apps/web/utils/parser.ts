import { ZodSchema } from "zod";

// Generic type for form validation state
export type ValidationFormState<T> = {
  errors?: {
    [K in keyof T]?: string[];
  };
  message?: string;
  data?: T;
  success: boolean;
};
// S
export async function validateForm<T>(
  schema: ZodSchema<T>,
  formData: FormData
): Promise<ValidationFormState<T>> {
  // Extract all form fields to pass to the schema
  const formEntries = Object.fromEntries(formData.entries());
  
  // Validate with the provided schem
  const validationResult = schema.safeParse(formEntries);
  
  if (!validationResult.success) {
    // Return field errors in the expected format
    return { 
      errors: validationResult.error.flatten().fieldErrors as {
        [K in keyof T]?: string[];
      },
      success: false
    };
  }

  return {
    success: true,
    errors: undefined
  }
  
  // Return the validated data
  return { 
    data: validationResult.data,
    success: true
  };
}