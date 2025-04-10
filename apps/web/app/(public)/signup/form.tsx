"use client";

import { signup } from "@/app/actions/auth";
import { useActionState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from "react";
export function SignupForm() {
	const [state, formAction] = useActionState(signup, undefined);

	useEffect(() => {
		console.log(state);
	}, [state]);

	return (
		<form action={formAction}>
			<Label htmlFor="email">Email</Label>	
			<Input name="email" type="email" />
            {state?.errors?.email && <p>{state.errors.email.join(", ")}</p>}
			<Label htmlFor="password">Password</Label>
			<Input name="password" type="password" />
            {state?.errors?.password && <p className="text-red-500">{state.errors.password.join(", ")}</p>}

			<Label htmlFor="first_name">First Name</Label>
			<Input name="first_name" type="text" />
            {state?.errors?.first_name && <p className="text-red-500">{state.errors.first_name.join(", ")}</p>}

			<Label htmlFor="last_name">Last Name</Label>
			<Input name="last_name" type="text" />
            {state?.errors?.last_name && <p className="text-red-500">{state.errors.last_name.join(", ")}</p>}
			
			<Button type="submit">Sign Up</Button>
		</form>
	);
}
