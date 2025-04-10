"use server";

import { registerUserSchema } from "@repo/types/schema";
import { revalidateTag } from "next/cache";

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
	const validationResult = registerUserSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validationResult.success) {
		return { errors: validationResult.error.flatten().fieldErrors };
	}

	const { email, password } = validationResult.data;

	const response = await fetch("http://localhost:3000/api/auth/signup", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});

	if (response.ok) {
		revalidateTag("me");
	}

	return response.json();
}

export type FormState =
	| {
			errors?: {
				first_name?: string[];
				last_name?: string[];
				email?: string[];
				password?: string[];
			};
			message?: string;
	  }
	| undefined;
