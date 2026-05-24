import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const productDetailHandler = () => {
    navigate(`/products/${product._id}`);
  };

  return (

    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={productDetailHandler}>

      {/* IMAGE SECTION */}

      <div className="relative bg-slate-100 overflow-hidden">

        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
        />

        {/* CATEGORY */}

        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold rounded-full text-slate-700 shadow-sm">

          {product.category?.name || "Uncategorized"}

        </span>

      </div>


      {/* CONTENT */}

      <div className="p-4">

        {/* TITLE + BRAND */}

        <div className="mb-3">

          <h2 className="text-base font-semibold text-slate-800 line-clamp-1">

            {product.title}

          </h2>

          <p className="text-sm text-slate-500">

            {product.brand}

          </p>

        </div>


        {/* DESCRIPTION */}

        <p className="text-sm text-slate-600 leading-5 line-clamp-2 min-h-[40px] mb-4">

          {product.description}

        </p>


        {/* FOOTER */}

        <div className="flex items-center justify-between">

          {/* PRICE + STOCK */}

          <div>

            <h3 className="text-xl font-bold text-slate-900">

              ${product.price}

            </h3>

            <p className="text-xs text-slate-500">

              {product.stock} items left

            </p>

          </div>


          {/* BUTTON */}

          <button className="bg-slate-900 hover:bg-black text-white text-sm font-medium px-4 py-2 rounded-xl transition" onClick={(e) => {

            e.stopPropagation(); // Prevent card click

            productDetailHandler(); // Navigate to product detail

          }}>

            Add

          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;