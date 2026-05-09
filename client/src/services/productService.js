import axios from "axios";

const BASE_URL = "https://dummyjson.com";

export const getProducts = async () => {
  const response = await axios.get(
    `${BASE_URL}/products`
  );

  const products = response.data.products;

  return products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    brand: product.brand,
    stock: product.stock,
    thumbnail: product.thumbnail,
  }));
};