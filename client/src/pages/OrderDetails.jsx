import React from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Truck, 
  ShoppingBag, 
  ArrowLeft,
  Clock,
  AlertCircle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderDetails, useCancelOrder } from "../hooks/orderHook";
import { toast } from "sonner";

// ==========================================
// CANCEL ORDER DIALOG COMPONENT (SHADCN)
// ==========================================
export function CancelOrderButton({ order, cancelOrderMutation, navigate }) {
  const isPending = cancelOrderMutation.isPending;

  const handleCancelOrder = () => {
    cancelOrderMutation.mutate(order._id, {
      onSuccess: () => {
        toast.success("Order cancelled successfully.");
        navigate('/orders-history');
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to cancel the order. Please try again.");
      }
    });
  };

  return (
    <AlertDialog>
      {/* Triggering action wrapper button */}
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="w-full gap-2 h-11 shadow-sm transition-all" 
          disabled={isPending}
        >
          <AlertCircle className="h-4 w-4" /> 
          {isPending ? "Processing Request..." : "Cancel This Order"}
        </Button>
      </AlertDialogTrigger>

      {/* Accessible Modal Overlay Configuration */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel your order, release product allocations, and initiate any applicable refunds.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Go Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              // Keeps modal alive while backend mutation executes asynchronously 
              e.preventDefault();
              handleCancelOrder();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Cancelling..." : "Yes, Cancel Order"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ==========================================
// MAIN ORDER DETAILS PAGE
// ==========================================
export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetching target transactional payload hooks
  const { data, isLoading, isError, error } = useGetOrderDetails(id);
  const cancelOrderMutation = useCancelOrder();

  const order = data?.order;

  // Helper formatting utility for cleaner timestamps
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Color mappings based on design system states
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // Loading Guard Screen
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-32 text-center text-sm font-medium text-slate-500 animate-pulse">
        Loading live order receipt details...
      </div>
    );
  }

  // Error Guard Screen 
  if (isError || !order) {
    return (
      <div className="container mx-auto max-w-md px-4 py-32 text-center">
        <Card className="border-red-100 shadow-sm">
          <CardContent className="pt-6 space-y-4 flex flex-col items-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <h3 className="text-lg font-bold text-slate-800">Order Record Not Found</h3>
            <p className="text-xs text-slate-500">
              {error?.response?.data?.message || "We couldn't parse or locate this transaction order record."}
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="w-full">
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Derived Business Logic configuration state variables
  const canCancelOrder = ["PENDING", "CONFIRMED"].includes(order.orderStatus);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      
      {/* Header Banner Section */}
      <div className="flex flex-col items-center text-center mb-8 space-y-3">
        <div className="rounded-full bg-emerald-50 p-3 text-emerald-600 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Order Placed Successfully!</h1>
        <p className="text-sm text-slate-500 max-w-md">
          Thank you for your purchase. Your order has been logged into our system and inventory holds are active.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* LEFT TWO COLUMNS: Detailed Breakdown Logs */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Order Meta Detail Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b bg-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</p>
                  <p className="text-sm font-mono font-bold text-slate-800 break-all">{order._id}</p>
                </div>
                <div className="flex gap-2 self-start sm:self-center">
                  <span className={`text-xs font-semibold px-2.5 py-1 border rounded-full ${getStatusBadgeClass(order.orderStatus)}`}>
                    Order: {order.orderStatus}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 border rounded-full ${getStatusBadgeClass(order.paymentStatus)}`}>
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
              
              <Separator />

              {/* Items Snapshot Mapping Loop */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                  <ShoppingBag className="h-4 w-4 text-slate-500" /> Items Snapshot
                </h3>
                {(order.items || []).map((item) => (
                  <div key={item._id} className="flex gap-4 items-center justify-between py-1">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-14 h-14 rounded object-cover border bg-slate-50 flex-shrink-0" 
                      />
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-slate-500">
                          ₹{item.price?.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      ₹{item.subtotal?.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery and Logistics Destination Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" /> Shipping Destination
                </h4>
                <div className="text-sm space-y-1 text-slate-700">
                  <p className="font-bold text-slate-900 capitalize">{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.addressLine1}</p>
                  {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
                  <p className="uppercase text-xs font-semibold text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                  <p>{order.shippingAddress?.postalCode} | {order.shippingAddress?.country}</p>
                  <p className="text-xs text-slate-500 pt-1">📞 +91 {order.shippingAddress?.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-slate-500" /> Transaction Strategy
                </h4>
                <div className="text-sm space-y-2">
                  <div>
                    <p className="text-xs text-slate-400">Method</p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {order.paymentMethod === 'ONLINE' ? 'Secured Gateway (Online)' : 'Cash on Delivery (COD)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Execution Priority</p>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 mt-1 bg-amber-50 px-2 py-1 border border-amber-100 rounded w-fit">
                      <Clock className="h-3.5 w-3.5" /> Awaiting Clearance
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* RIGHT COLUMN: Total Invariant Receipt Summary */}
        <div className="md:col-span-1 space-y-4">
          <Card className="shadow-sm border-t-4 border-t-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800">Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span>₹{order.subtotal?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fees</span>
                <span>₹{order.shippingFee?.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1">
                <span>Grand Total</span>
                <span>₹{order.totalAmount?.toFixed(2)}</span>
              </div>

            </CardContent>
          </Card>

          {/* Core App Navigation Controls */}
          <div className="flex flex-col gap-2">
            <Button 
              className="w-full gap-2 h-11"
              onClick={() => navigate('/')}
            >
              <Truck className="h-4 w-4" /> Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              className="w-full gap-2 h-11 border-slate-200 text-slate-600 hover:text-slate-900"
              onClick={() => navigate('/orders-history')}
            >
              <ArrowLeft className="h-4 w-4" /> View All Orders
            </Button>
          </div>

          {/* Conditional Rendering of the shadcn AlertDialog Action */}
          {canCancelOrder && (
            <div className="pt-2">
              <CancelOrderButton 
                order={order} 
                cancelOrderMutation={cancelOrderMutation} 
                navigate={navigate} 
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}