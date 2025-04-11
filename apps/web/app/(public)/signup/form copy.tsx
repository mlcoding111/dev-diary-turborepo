// CLIENT COMPONENT
"use client";

import { signup } from "@/app/actions/auth";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { TSerializedMe, TRegisterUser } from "@repo/types/schema";
import { TFormSubmitResponse } from "@repo/types/api";

// The form fields we're validating
type FormFields = keyof TRegisterUser;

// Type for state to be compatible with both input validation and API response
type SignupState = TFormSubmitResponse<TSerializedMe> | undefined;

export function SignupForm() {
  const [state, formAction] = useActionState<SignupState, FormData>(signup, undefined);

  useEffect(() => {
    console.log(state);
  }, [state]);

  // Helper function to check if state has errors for a given field
  const hasErrors = (field: FormFields) => {
    if (!state) return false;
    if ("errors" in state && state.errors && field in state.errors) {
      return Boolean(state.errors[field as keyof typeof state.errors]);
    }
    return false;
  };

  // Helper function to get error messages
  const getErrorMessage = (field: FormFields) => {
    if (!state || !("errors" in state) || !state.errors) return "";
    const errors = state.errors[field as keyof typeof state.errors];
    return errors ? (Array.isArray(errors) ? errors.join(", ") : errors as string) : "";
  };

  return (
    <form action={formAction}>
      <Label htmlFor="email">Email</Label>
      <Input name="email" type="email" />
      {hasErrors("email") && <p className="text-red-500">{getErrorMessage("email")}</p>}

      <Label htmlFor="password">Password</Label>
      <Input name="password" type="password" />
      {hasErrors("password") && <p className="text-red-500">{getErrorMessage("password")}</p>}

      <Label htmlFor="first_name">First Name</Label>
      <Input name="first_name" type="text" />
      {hasErrors("first_name") && (
        <p className="text-red-500">{getErrorMessage("first_name")}</p>
      )}

      <Label htmlFor="last_name">Last Name</Label>
      <Input name="last_name" type="text" />
      {hasErrors("last_name") && (
        <p className="text-red-500">{getErrorMessage("last_name")}</p>
      )}

      <Button type="submit">Sign Up</Button>
    </form>
  );
}
