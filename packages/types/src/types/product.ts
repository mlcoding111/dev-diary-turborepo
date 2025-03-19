export interface IProduct {
	id: string;
	name: string;
	title: string;
	description: string;
	price: number;
}

export interface ISerializedProduct extends Omit<IProduct, "price"> {}
