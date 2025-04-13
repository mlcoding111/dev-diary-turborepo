import { TApiResponse } from "@repo/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ICallFetchOptions<TPayloadData> = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    data?: TPayloadData;
    headers?: Record<string, string>;
    url: string;
}

export async function callFetch<TData, TPayloadData = unknown>(fetchOptions: ICallFetchOptions<TPayloadData>): Promise<TApiResponse<TData>> {
    const url = `${BASE_URL}${fetchOptions.url}`;

    const headers = {
        ...fetchOptions.headers,
        "Content-Type": "application/json",
        "Origin": process.env.NEXT_PUBLIC_URL || "",
    }
    
    try{
        const response = await fetch(url, {
            method: fetchOptions.method,
            body: fetchOptions.data ? JSON.stringify(fetchOptions.data) : undefined,
            headers,
        }).then(res => res.json());

        console.log('The response is', response);
        
        if(!response.success && fetchOptions.method === "GET"){
            throw new Error(JSON.stringify(response));
        }

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw error;
    }
}
