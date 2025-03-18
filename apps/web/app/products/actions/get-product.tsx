import { TProduct } from "@repo/types/schema";

export default async function getProducts(): Promise<TProduct[]> {
    const response = await fetch(`${process.env.API_URL}/products`, {
        next: { tags: ["products"] }
    });
    return await response.json();
}
