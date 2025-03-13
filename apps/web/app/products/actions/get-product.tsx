import { Product } from "@repo/types";

export default async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${process.env.API_URL}/products`, {
        next: { tags: ["products"] }
    });
    return await response.json();
}
