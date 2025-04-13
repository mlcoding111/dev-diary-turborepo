import { TApiResponse } from "@repo/types/api";
import { TSerializedMe } from "@repo/types/schema";
import { verifySession } from "@/lib/session";
import { cache } from "react";
import { revalidateTag } from "next/cache";

export const getMe = cache(async (): Promise<TApiResponse<TSerializedMe>> => {
    // 1. Verify session
    const session = await verifySession();

    // 2. Fetch user
    const response: TApiResponse<TSerializedMe> = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        headers: {
            Authorization: `Bearer ${session.userId}`
        }
    }).then(res => res.json());

    if(response.success){
        revalidateTag("me");
    }

    if(!response.data){
        throw new Error("User not found");
    }

    return response;
});