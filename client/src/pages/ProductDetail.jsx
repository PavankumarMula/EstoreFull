import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetProductById } from "../hooks/productHook";
import { useAddToCart, useGetCart } from "../hooks/cartHook";
import {
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from 'sonner'

function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductById(id);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const { data: cart } = useGetCart();
  const queryClient = useQueryClient();

  // State to track which image is currently selected in the viewer
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1); // Default to 1 or the current cart quantity for this product if it exists  

  // Update the main image once the product data successfully loads
  useEffect(() => {
    if (product?.thumbnail) {
      setActiveImage(product.thumbnail);
    } else if (product?.images && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const addToCartHandler =
    () => {

      addToCart(
        {
          productId:
            product._id,

          quantity,
        },
        {
          onSuccess: () => {
            toast.success(
              "Added to cart"
            );
            queryClient.invalidateQueries({
              queryKey: ["cart"],
            });
          },
          onError: () => {
            toast.error(
              "Failed to add to cart. Please try again."
            );
          },  
        }
      );
    };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading product details...</span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg inline-block max-w-md shadow-sm">
          <h3 className="text-lg font-bold mb-2">Error Loading Product</h3>
          <p className="text-sm opacity-90 mb-4">We couldn't retrieve the details for this item. The link may be broken or the product no longer exists.</p>
          <Link to="/products" className="inline-block bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blue-600 transition">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium truncate">{product.title}</span>
      </nav>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-xl shadow-sm p-6 sm:p-8">

        {/* Left Column: Media Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Visual Display */}
          <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
            <img
              src={activeImage}
              alt={product.title}
              className="max-h-full max-w-full object-contain p-4 transition-all duration-300"
            />
          </div>

          {/* Thumbnails Selection Stream */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {/* Include Thumbnail as an option if present */}
              {product.thumbnail && (
                <button

                  onClick={() => setActiveImage(product.thumbnail)}
                  className={`w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden bg-gray-50 p-1 transition ${activeImage === product.thumbnail ? "border-blue-600 shadow-sm" : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                >
                  <img src={product.thumbnail} alt="Main thumbnail" className="w-full h-full object-contain" />
                </button>
              )}

              {/* Array Images loop */}
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden bg-gray-50 p-1 transition ${activeImage === img ? "border-blue-600 shadow-sm" : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Brand and Stock Status Badge */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                {product.brand || "Generic"}
              </span>
              {product.stock > 0 ? (
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md">
                  In Stock ({product.stock} left)
                </span>
              ) : (
                <span className="text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-md">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {product.title}
            </h1>

            {/* Rating System Overview */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-amber-500">
                {/* Simple Star Render Matrix */}
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? "fill-current" : "text-gray-200"}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{product.rating} / 5</span>
            </div>

            <hr className="border-gray-100 my-4" />

            {/* Pricing Section */}
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-gray-900">
                ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <p className="text-xs text-gray-400 mt-1">Local taxes and shipping calculated at checkout.</p>
            </div>

            {/* Detailed Description Paragraph */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Interactive Elements */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-4">

            {/* Quantity Selector Selector Row */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                  <button

                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-gray-800 font-semibold min-w-[40px] text-center bg-white border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                disabled={product.stock <= 0}
                onClick={addToCartHandler}
                className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold shadow-sm hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
              >
                {
                  isAddingToCart
                    ? "Adding..."
                    : "Add to Cart"
                }
              </button>
              <button
                disabled={product.stock <= 0 || isAddingToCart}
                onClick={() => console.log(`Proceeding to checkout with ${quantity} item(s)`)}
                className="flex-1 bg-gray-900 text-white text-center py-3 px-6 rounded-lg font-semibold shadow-sm hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
              >
                Buy Now
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetail;