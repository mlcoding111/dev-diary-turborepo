// UTILS/PARSER.TS
import { ZodSchema } from "zod";

// Generic type for form validation state
export type ValidationFormState<T> = {
  errors?: Record<string, string[]>;
  data: T;
  success: boolean;
};

export async function validateForm<T>(
  schema: ZodSchema<T>,
  formData: FormData
): Promise<ValidationFormState<T> & { success: boolean }> {
  // Extract all form fields
  const formEntries = Object.fromEntries(formData.entries());
  
  // Validate with schema
  const validationResult = schema.safeParse(formEntries);
  
  if (!validationResult.success) {
    // Format errors properly
    return { 
      errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
      data: {} as T, // Empty object cast as T since we know validation failed
      success: false
    };
  }

  // Successful validation
  return {
    data: validationResult.data,
    success: true
  };
}

  // // Helper function to check if state has errors for a given field
  // export const hasErrors = <T, K extends keyof T>(field: K, state: ValidationFormState<T>) => {
  //   if (!state) return false;
  //   if ("errors" in state && state.errors && field in state.errors) {
  //     return Boolean(state.errors[field as keyof typeof state.errors]);
  //   }
  //   return false;
  // };

  // // Helper function to get error messages
  // export const getErrorMessage = <T, K extends keyof T>(field: K, state: ValidationFormState<T>) => {
  //   if (!state || !("errors" in state) || !state.errors) return "";
  //   const errors = state.errors[field as keyof typeof state.errors];
  //   return errors ? (Array.isArray(errors) ? errors.join(", ") : errors as string) : "";
  // };