import createProduct from "./actions/create-product";

export default async function CreateProduct() {
  return (
    <div>
      <form action={createProduct}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" name="title" id="title" />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description" />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
}