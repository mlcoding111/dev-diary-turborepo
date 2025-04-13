// SERVER ACTION
"use server";

import { TRegisterUser } from "@repo/types/schema";
import { revalidateTag } from "next/cache";
import { TApiResponse } from "@repo/types/api";
import { TSerializedMe } from "@repo/types/schema";

export async function signup(
	data: TRegisterUser,
): Promise<TApiResponse<TSerializedMe>> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		revalidateTag("me");
	}

	return response.json();
}
