"use client";

import { signup } from "@/app/actions/auth";
import { FormState } from "@/app/actions/auth";
import { useActionState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignupForm() {
	const [state, formAction] = useActionState<FormState>(signup, undefined);

	return (
		<form action={formAction}>
			<Label htmlFor="email">Email</Label>	
			<Input name="email" type="email" />
            {state?.errors?.email && <p>{state.errors.email.join(", ")}</p>}
			<Label htmlFor="password">Password</Label>
			<Input name="password" type="password" />
            {state?.errors?.password && <p>{state.errors.password.join(", ")}</p>}
			<Button type="submit">Sign Up</Button>
		</form>
	);
}
