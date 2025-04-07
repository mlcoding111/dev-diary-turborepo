"use client";

import { signup } from "@/app/actions/auth";
import { FormState } from "@/app/actions/auth";
import { useActionState } from "react";

export function SignupForm() {
	const [state, formAction] = useActionState<FormState>(signup, undefined);

	return (
		<form action={formAction}>
			<input name="email" type="email" />
			<label htmlFor="email">Email</label>	
            {state?.errors?.email && <p>{state.errors.email.join(", ")}</p>}
			<input name="password" type="password" />
			<label htmlFor="password">Password</label>
            {state?.errors?.password && <p>{state.errors.password.join(", ")}</p>}
			<button type="submit">Sign Up</button>
		</form>
	);
}
