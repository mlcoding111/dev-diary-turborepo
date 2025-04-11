// SERVER ACTION
"use server";

import { registerUserSchema, TRegisterUser } from "@repo/types/schema";
import { revalidateTag } from "next/cache";
import { TFormSubmitResponse, TApiResponse } from "@repo/types/api";
import { TSerializedMe } from "@repo/types/schema";

export async function signup(
	prevState: TFormSubmitResponse<TSerializedMe> | undefined,
	formData: FormData,
): Promise<TFormSubmitResponse<TSerializedMe>> {
	const data = Object.fromEntries(formData.entries());
	const validationResult = registerUserSchema.safeParse(data);

	if (!validationResult.success) {
		// Return validation errors with the same shape as TFormSubmitResponse
		return {
			success: false,
			errors: validationResult.error.flatten().fieldErrors,
		};
	}

	const { email, password, first_name, last_name } = validationResult.data;

	const response = await fetch("http://localhost:3000/api/auth/signup", {
		method: "POST",
		body: JSON.stringify({ email, password, first_name, last_name }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		revalidateTag("me");
	}

	const responseData = (await response.json()) as TApiResponse<TSerializedMe>;
	return responseData;
}
