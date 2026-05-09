import React, { useState, useEffect } from "react";

import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSideBar";

const categories = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-semibold text-slate-700">
          Loading Products...
        </h1>
      </div>
    );
  }

  return (
    <div>

      <div className="flex items-end justify-between mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Explore Products
          </h1>

          <p className="text-slate-500 text-lg">
            Discover trending collections
          </p>
        </div>

      </div>

      <div className="flex gap-6">

        <aside className="w-64 shrink-0">
          <FilterSidebar categories={categories} />
        </aside>

        <section className="flex-1">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        </section>

      </div>
    </div>
  );
}

export default Home;