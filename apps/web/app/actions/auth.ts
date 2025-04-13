// SERVER ACTION
"use server";

import { TRegisterUser } from "@repo/types/schema";
import { revalidateTag } from "next/cache";
import { TApiResponse } from "@repo/types/api";
import { TSerializedMe } from "@repo/types/schema";
import { createSession } from "@/lib/session";
import { callFetch } from "@/lib/api";

export async function signup(
	data: TRegisterUser,
): Promise<TApiResponse<TSerializedMe>> {
	const response = await callFetch<TSerializedMe>({
		method: "POST",
		data,
		url: "/auth/register",
	})

	if (response.success) {
		revalidateTag("me");
		await createSession(response.data?.user?.id);
	}

	return response;
}
