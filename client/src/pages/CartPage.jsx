import React, { useState } from 'react';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {useGetCart,useAddToCart,useRemoveFromCart,useClearCart,useUpdateCartItem} from "../hooks/cartHook";
import { useQueryClient } from "@tanstack/react-query";
import {toast} from "sonner"
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
   const { data, isLoading, error } = useGetCart();
   const addToCart = useAddToCart();
   const removeFromCart = useRemoveFromCart();
   const clearCart = useClearCart();
   const updateCartItem = useUpdateCartItem();

   if (isLoading) return <p>Loading cart...</p>;
   if (error) return <p>Error loading cart: {error.message}</p>;

   console.log("Fetched Cart Data:", data);


  // Calculate totals
  const subtotal = data?.summary?.totalPrice || 0;
  const shipping = 0.00; // Free shipping
  const total = subtotal + shipping;

  const cartItems = data?.cart?.items || [];

 const updateQuantity =
  (productId, quantity) => {

    updateCartItem.mutate(
      {
        productId,
        quantity,
      },
      {
        onSuccess: () => {

          queryClient.invalidateQueries({
            queryKey: ["cart"],
          });

          toast.success(
            "Cart updated"
          );
        },
      }
    );
};

// remove item from cart
const removeItem =
  (productId) => {

    removeFromCart.mutate(
      productId,
      {
        onSuccess: () => {

          queryClient.invalidateQueries({
            queryKey: ["cart"],
          });

          toast.success(
            "Item removed from cart"
          );
        },
      }
    );
};

  

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8 flex items-center gap-2">
        <ShoppingBag className="h-8 w-8" /> Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 pt-6">
            <div className="rounded-full bg-slate-100 p-4">
              <ShoppingBag className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700">Your cart is empty</h2>
            <p className="text-sm text-slate-500 max-w-xs">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button className="mt-2">Continue Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: List of Items */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  
                  {/* Product Info Block */}
                  <div className="flex gap-4 items-center w-full sm:w-auto">
                    <img 
                      src={item.product.thumbnail} 
                      alt={item.product.title} 
                      className="w-20 h-20 rounded-md object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://placehold.co/150'; }} // quick image fallback
                    />
                    <div className="space-y-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 inline-block">
                        {item.product.brand}
                      </span>
                      <h3 className="font-semibold text-slate-800 line-clamp-1">{item.product.title}</h3>
                      <p className="text-sm font-medium text-slate-600">${item.product.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Quantity & Actions Layout Block */}
                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0">
                    
                    {/* Shadcn UI Buttons used for Quantity Switcher */}
                    <div className="flex items-center border rounded-md h-9 bg-slate-50">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-none text-slate-500 hover:text-slate-900"
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium text-slate-800">
                        {item.quantity}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-none text-slate-500 hover:text-slate-900"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Subtotal & Delete Action */}
                    <div className="flex items-center gap-4 min-w-[100px] justify-end">
                      <p className="font-semibold text-slate-900 text-right">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Column: Order Summary Summary Card */}
          <Card className="lg:col-span-4 shadow-sm bg-slate-50/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
    
              <Button  className="cursor-pointer w-full h-11 mt-2 text-sm font-medium tracking-wide" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </Button>
              
              <p className="text-xs text-center text-slate-400 mt-2">
                Secure 256-bit SSL encrypted transaction payments.
              </p>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}