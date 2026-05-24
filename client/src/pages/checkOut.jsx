import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Truck, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { usecreateOrder } from "../hooks/orderHook";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCart } from "../hooks/cartHook";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // 1. Core API Query Hooks
  const { data: cartData, isLoading } = useGetCart();
  const createOrder = usecreateOrder();

  // 2. Form State mapping to your backend Mongoose nested validation constraints
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [errors, setErrors] = useState({});

  // Financial aggregates calculated safely from your live summary pipeline
  const subtotal = cartData?.summary?.totalPrice || 0;
  const shippingFee = 0; 
  const totalAmount = subtotal + shippingFee;

  // 3. Structural Field Level Verification 
  const validateField = (name, value) => {
    let errorMsg = '';

    if (name !== 'addressLine2' && !value.trim()) {
      errorMsg = 'This field is required';
    } else {
      if (name === 'phone') {
        const phoneRegex = /^[6-9]\d{9}$/; 
        if (!phoneRegex.test(value)) errorMsg = 'Enter a valid 10-digit Indian phone number';
      }
      if (name === 'postalCode') {
        const pinRegex = /^\d{6}$/; 
        if (!pinRegex.test(value)) errorMsg = 'Postal code must be exactly 6 digits';
      }
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'postalCode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 6);
    }

    setShippingAddress(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) validateField(name, formattedValue);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // 4. Order Assembly and Mutation Processing
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Audit check on all required entry lines
    const formErrors = {};
    Object.keys(shippingAddress).forEach(key => {
      if (key !== 'addressLine2') {
        if (!shippingAddress[key].trim()) {
          formErrors[key] = 'This field is required';
        }
      }
    });

    const hasErrors = Object.values(formErrors).some(err => err !== '') || 
                      Object.values(errors).some(err => err !== '');

    if (hasErrors) {
      setErrors(prev => ({ ...prev, ...formErrors }));
      toast.error("Please correct the address details before checking out.");
      return;
    }

    if (!cartData?.cart?.items || cartData.cart.items.length === 0) {
      toast.error("Your shopping cart appears to be empty.");
      return;
    }

    // MAP PAYLOAD EXACTLY TO MATCH YOUR BACKEND MONGOOSE SCHEMA DEFINITIONS
    const orderPayload = {
      shippingAddress,
      paymentMethod,
    };

    // Fire the async database transaction mutation lifecycle
    createOrder.mutate(orderPayload, {
  onSuccess: (data) => {
    toast.success("Order created successfully!");
    
    // Invalidate collections caches
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['order-history'] });
    
    // FIX: Read 'orderId' as named by your backend response
    const actualId = data?.orderId; 
    
    if (actualId) {
      navigate(`/order-success/${actualId}`);
    } else {
      console.error("Payload mismatch. Received:", data);
      toast.error("Order created, but tracking reference was lost.");
    }
  },
  onError: (err) => {
    toast.error(err?.response?.data?.message || "Inventory stock verification failed.");
  }
});
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-32 text-center text-sm font-medium text-slate-500">
        Syncing live secure checkout data pipeline...
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6 gap-2 text-slate-600 hover:text-slate-900 pl-0"
        onClick={() => navigate('/cart')}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Shipping Configuration & Payment Interfaces */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <Truck className="h-5 w-5 text-slate-500" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Full Name</label>
                  <Input name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} onBlur={handleBlur} placeholder="Mula Patel" className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.fullName && <p className="text-xs font-medium text-red-500">{errors.fullName}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Mobile Number</label>
                  <Input name="phone" type="tel" value={shippingAddress.phone} onChange={handleInputChange} onBlur={handleBlur} placeholder="9876543210" className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.phone && <p className="text-xs font-medium text-red-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Address Line 1 (Flat, House no., Apartment)</label>
                <Input name="addressLine1" value={shippingAddress.addressLine1} onChange={handleInputChange} onBlur={handleBlur} placeholder="Flat 401, Sapphire Heights" className={errors.addressLine1 ? "border-red-500 focus-visible:ring-red-500" : ""} />
                {errors.addressLine1 && <p className="text-xs font-medium text-red-500">{errors.addressLine1}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Address Line 2 (Optional - Area, Street, Landmark)</label>
                <Input name="addressLine2" value={shippingAddress.addressLine2} onChange={handleInputChange} placeholder="Near City Tech Park" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">City</label>
                  <Input name="city" value={shippingAddress.city} onChange={handleInputChange} onBlur={handleBlur} placeholder="Hyderabad" className={errors.city ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.city && <p className="text-xs font-medium text-red-500">{errors.city}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">State</label>
                  <Input name="state" value={shippingAddress.state} onChange={handleInputChange} onBlur={handleBlur} placeholder="Telangana" className={errors.state ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.state && <p className="text-xs font-medium text-red-500">{errors.state}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Pincode</label>
                  <Input name="postalCode" value={shippingAddress.postalCode} onChange={handleInputChange} onBlur={handleBlur} placeholder="500081" className={errors.postalCode ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.postalCode && <p className="text-xs font-medium text-red-500">{errors.postalCode}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Country</label>
                <Input name="country" value={shippingAddress.country} disabled className="bg-slate-50 text-slate-500 cursor-not-allowed" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <CreditCard className="h-5 w-5 text-slate-500" /> Payment Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div 
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${paymentMethod === 'ONLINE' ? 'border-slate-900 bg-slate-50/50 ring-1 ring-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">Online Payment</p>
                  <p className="text-[11px] text-slate-500">Credit/Debit Card, UPI, NetBanking</p>
                </div>
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'border-slate-900' : 'border-slate-300'}`}>
                  {paymentMethod === 'ONLINE' && <div className="h-2 w-2 rounded-full bg-slate-900" />}
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center justify-between ${paymentMethod === 'COD' ? 'border-slate-900 bg-slate-50/50 ring-1 ring-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">Cash On Delivery (COD)</p>
                  <p className="text-[11px] text-slate-500">Pay cash right at your doorstep</p>
                </div>
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === 'COD' ? 'border-slate-900' : 'border-slate-300'}`}>
                  {paymentMethod === 'COD' && <div className="h-2 w-2 rounded-full bg-slate-900" />}
                </div>
              </div>

            </CardContent>
          </Card>

          <Button type="submit" disabled={createOrder.isPending} className="w-full h-12 text-sm font-semibold tracking-wide shadow-sm">
            {createOrder.isPending ? "Validating & Locking Stock..." : `Place Order (₹${totalAmount.toFixed(2)})`}
          </Button>

        </form>

        {/* RIGHT COLUMN: Order Review Line Items */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4" /> Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {cartData?.cart?.items?.map((item) => {
                const prod = item.product;
                if (!prod) return null;
                return (
                  <div key={item._id} className="flex gap-4 items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={prod.thumbnail} 
                        alt={prod.title} 
                        className="w-12 h-12 rounded object-cover border bg-slate-50 flex-shrink-0" 
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{prod.title}</h4>
                        <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{prod.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      ₹{(prod.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}

              <Separator />

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 mt-4 flex items-start gap-2.5 border border-slate-100">
                <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Your transaction is secure. Placing your order creates a temporary inventory hold to confirm delivery.
                </p>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}