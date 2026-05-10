import React, {
  useState,
} from "react";

import {
  useGetProducts,
} from "../hooks/productHook";
import {
  useGetCategories,
} from "../hooks/categoryHook";

import ProductCard from "../components/ProductCard";

import FilterSidebar from "../components/FilterSideBar";


function Home() {

  // =====================================
  // FILTER STATE
  // =====================================

  const [filters, setFilters] =
    useState({

      page: 1,

      limit: 12,

      search: "",

      category: "",

      maxPrice: 5000,

      sort: "newest",

      inStock: false,
    });


  // =====================================
  // PRODUCTS
  // =====================================

  const {
    data,
    isLoading,
    isFetching,
  } = useGetProducts(filters);


  const products =
    data?.products || [];

  const pagination =
    data?.pagination;


  // =====================================
  // CATEGORIES
  // =====================================
  const {
  data: categoryData,
} = useGetCategories();

const categories =
  categoryData?.categories || [];
  


  if (isLoading) {

    return (
      <div className="flex items-center justify-center h-[70vh]">

        Loading...

      </div>
    );
  }


  return (

    <div>

      <div className="flex gap-6">

        {/* SIDEBAR */}

        <aside className="w-72 shrink-0">

          <FilterSidebar

            categories={categories}

            filters={filters}

            setFilters={setFilters}

          />

        </aside>


        {/* PRODUCTS */}

        <section className="flex-1">

          {isFetching && (
            <p className="mb-4 text-sm">
              Updating products...
            </p>
          )}


          {/* GRID */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
              />

            ))}

          </div>


          {/* PAGINATION */}

          <div className="flex items-center justify-center gap-4 mt-10">

            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page:
                    prev.page - 1,
                }))
              }
              disabled={
                !pagination?.hasPrevPage
              }
              className="px-5 py-2 border rounded-xl"
            >
              Previous
            </button>


            <div>

              Page {" "}
              {pagination?.currentPage}
              {" "}of{" "}
              {pagination?.totalPages}

            </div>


            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page:
                    prev.page + 1,
                }))
              }
              disabled={
                !pagination?.hasNextPage
              }
              className="px-5 py-2 border rounded-xl"
            >
              Next
            </button>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Home;