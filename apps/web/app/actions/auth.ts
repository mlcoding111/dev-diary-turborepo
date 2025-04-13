// SERVER ACTION
"use server";

import { TRegisterUser } from "@repo/types/schema";
import { revalidateTag } from "next/cache";
import { TApiResponse } from "@repo/types/api";
import { TSerializedMe } from "@repo/types/schema";
import { createSession } from "@/lib/session";

export async function signup(
	data: TRegisterUser,
): Promise<TApiResponse<TSerializedMe>> {
	const response: TApiResponse<TSerializedMe> = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
	}).then(res => res.json());

	if (response.success) {
		revalidateTag("me");
	}

	const user = response.data;

	await createSession(user?.id);

	return response;
}
