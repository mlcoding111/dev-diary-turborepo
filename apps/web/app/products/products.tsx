import getProducts from "./actions/get-product";

export default async function Products() {
    const products = await getProducts();

    return (
        <div>
            <h1>Products</h1>
            {products.map((product) => (
                <div key={product.id}>
                    <h2>{product.title}</h2>
                    <p>{product.description}</p>
                    <p>{product.price}</p>
                </div>
            ))}
        </div>
    )
}
