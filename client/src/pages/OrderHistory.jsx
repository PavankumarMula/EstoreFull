import React from 'react';
import { useNavigate } from "react-router-dom";
import { useGetOrderHistory } from "../hooks/orderHook";
import { 
  ShoppingBag, 
  Calendar, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package,
  AlertCircle 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  
  // 1. Sync live backend data array via your TanStack Query hook
  const { data: orders, isLoading, isError, error } = useGetOrderHistory();
  console.log("Fetched Order History Data:", orders); // Debug log to verify data structure and content
    const ordersList = orders?.orders || []; // Safely access orders array from the response
  // Helper date formatting utility for localized timestamp logs
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Maps orderStatus configuration directly to Shadcn badge color tones
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'DELIVERED': 
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50';
      case 'CANCELLED': 
        return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50';
      case 'PENDING': 
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50';
      default: 
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50';
    }
  };

  // 2. Global Loading Component View
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-32 flex flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
        <p className="text-sm font-medium text-slate-500">Synchronizing your order ledger database history...</p>
      </div>
    );
  }

  // 3. Global Error Component View
  if (isError) {
    return (
      <div className="container mx-auto max-w-md px-4 py-32 text-center">
        <Card className="border-red-100 shadow-sm">
          <CardContent className="pt-6 space-y-4 flex flex-col items-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <h3 className="text-lg font-bold text-slate-800">Failed to load purchase history</h3>
            <p className="text-xs text-slate-500">
              {error?.response?.data?.message || "Internal server trace issue occurred while compiling records."}
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="w-full">
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 4. Empty State Guard (User has zero orders inside the MongoDB array)
  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-2">
          <ShoppingBag className="h-8 w-8" /> My Orders
        </h1>
        <Card className="p-12 text-center border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 pt-6">
            <div className="rounded-full bg-slate-100 p-4 text-slate-400">
              <Package className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700">No orders found</h2>
            <p className="text-sm text-slate-500 max-w-xs">
              Looks like you haven't placed any orders yet. Once you make a purchase, it will appear here.
            </p>
            <Button className="mt-2" onClick={() => navigate('/')}>
              Explore Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      
      {/* Header Panel Titles */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-slate-800" /> Order History
        </h1>
        <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-slate-50 text-slate-600">
          Total Orders: {ordersList.length}
        </Badge>
      </div>

      {/* Main Historical Orders List Feed Stack */}
      <div className="space-y-6">
        {ordersList.map((order) => {
          // Total items counter per order document snapshot array
          const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

          return (
            <Card key={order._id} className="shadow-sm hover:shadow-md transition-all border border-slate-200 overflow-hidden">
              
              {/* Order Row Sub-Header Block */}
              <CardHeader className="bg-slate-50/70 border-b p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 text-xs font-medium text-slate-500">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Placed</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-slate-800 font-semibold">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Billed</p>
                    <p className="mt-0.5 text-sm font-extrabold text-slate-900">₹{order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Token ID</p>
                    <p className="mt-0.5 font-mono text-slate-700 font-semibold truncate max-w-[140px] sm:max-w-none">{order._id}</p>
                  </div>
                </div>

                {/* Status Badges Flag Container */}
                <div className="flex gap-2 self-start sm:self-auto">
                  <Badge variant="outline" className={`text-xs font-bold px-2.5 py-0.5 border rounded-full tracking-wide ${getStatusBadgeVariant(order.orderStatus)}`}>
                    {order.orderStatus}
                  </Badge>
                </div>
              </CardHeader>

              {/* Order Row Body Content Content View */}
              <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
                
                {/* Horizontal product items thumb scroller layout row */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin max-w-full sm:max-w-xl">
                  {order.items?.map((item, idx) => (
                    <div key={item._id || idx} className="relative flex-shrink-0 group">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-16 h-16 rounded-md border object-cover bg-slate-50 border-slate-200 shadow-2xs group-hover:border-slate-400 transition-colors" 
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white font-bold rounded-full text-[10px] h-4 w-4 flex items-center justify-center border border-white shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                  
                  {/* Summary context detail label text */}
                  <div className="pl-2 text-xs font-medium text-slate-500 flex flex-col justify-center min-w-[100px]">
                    <span className="text-slate-800 font-bold">{itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Payment: {order.paymentStatus}</span>
                  </div>
                </div>

                {/* Primary Action Button Redirecting to Individual Detail View */}
                <div className="flex items-center justify-end sm:border-l sm:pl-6 border-slate-100 min-w-[140px]">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full gap-1 border-slate-200 text-slate-700 hover:text-slate-900 font-semibold group h-9 shadow-2xs"
                    onClick={() => navigate(`/order-success/${order._id}`)} // Reuses your dynamic detail handler path beautifully
                  >
                    Manage Order
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}