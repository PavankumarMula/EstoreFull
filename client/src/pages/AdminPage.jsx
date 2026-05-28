import React, { useState, useEffect } from "react";
import { useGetAdminOrders, useUpdateOrderStatusForAdmin } from "../hooks/orderHook";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  RefreshCw, 
  Filter, 
  Calendar 
} from "lucide-react";

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  // ==========================================
  // STATE MANAGEMENT FOR BACKEND QUERY PARAMS
  // ==========================================
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Local state to keep track of row-specific dropdown choices before clicking "Update"
  const [selectedStatuses, setSelectedStatuses] = useState({});

  // Debounce the search input by 500ms to save backend processing overhead
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset back to page 1 whenever search constraints alter
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // ==========================================
  // DATA FETCHING & MUTATION HOOK CONTEXT
  // ==========================================
  const { data, isLoading, error, isRefetching, refetch } = useGetAdminOrders({
    page,
    limit,
    status: status || undefined,
    search: debouncedSearch || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sortBy,
    sortOrder,
  });

  const updateOrderStatusForAdmin = useUpdateOrderStatusForAdmin();

  // Destructure custom properties matching your express backend controller's payload
  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || 1;

  // Track status updates locally on change
  const handleDropdownLocalChange = (orderId, newStatus) => {
    setSelectedStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  // Submit status update to backend server
  const handleStatusChangeSubmit = (orderId, fallbackCurrentStatus) => {
    const targetStatus = selectedStatuses[orderId] || fallbackCurrentStatus;
    
    console.log(`Submitting status update for Order ID: ${orderId}, Target Status: ${targetStatus}`);

    if (!targetStatus) {
      toast.info("Could not determine target status variant.");
      return;
    }

    updateOrderStatusForAdmin.mutate(
      { orderId, status: targetStatus },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
          toast.success(`Order [${orderId.slice(-6)}] status successfully updated to ${targetStatus}`);
          
          // Clear tracking buffer entry for this row upon completion
          setSelectedStatuses(prev => {
            const updated = { ...prev };
            delete updated[orderId];
            return updated;
          });
        },
        onError: (error) => {
          toast.error("Failed to update order status: " + (error?.response?.data?.message || error.message));
        },
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
      case "CONFIRMED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "SHIPPED": return "bg-purple-100 text-purple-700 border-purple-200";
      case "DELIVERED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "CANCELLED": return "bg-rose-100 text-rose-700 border-rose-200";
      case "PAID": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col sticky top-0 h-screen flex-shrink-0">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Store Manager</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full text-left px-4 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm">
            Dashboard Orders
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition text-sm">
            Products Catalog
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition text-sm">
            Customers
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 space-y-6 min-w-0">
        
        {/* HEADER BLOCK */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fulfillment Console</h2>
            <p className="text-sm text-slate-500 mt-1">Real-time pipeline balancing and server state controls</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search items title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-black transition bg-white shadow-sm"
              />
            </div>

            <button 
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition active:scale-95 disabled:opacity-50 shadow-sm"
              title="Force Sync Ledger"
            >
              <RefreshCw className={`h-4 w-4 text-slate-600 ${(isLoading || isRefetching) ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* COMPREHENSIVE FILTER CONSOLE CONTROL BAR */}
        <div className="bg-white rounded-2xl border p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status Filter
            </label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-50 outline-none cursor-pointer"
            >
              <option value="">All Operational Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3 w-3" /> From Date
            </label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full text-xs font-medium px-3 py-1.5 border rounded-xl bg-slate-50 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3 w-3" /> To Date
            </label>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full text-xs font-medium px-3 py-1.5 border rounded-xl bg-slate-50 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metrics Arrangement</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
                setPage(1);
              }}
              className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-50 outline-none cursor-pointer"
            >
              <option value="createdAt-desc">Date: Latest First</option>
              <option value="createdAt-asc">Date: Oldest First</option>
              <option value="totalAmount-desc">Value: High to Low</option>
              <option value="totalAmount-asc">Value: Low to High</option>
            </select>
          </div>
        </div>

        {/* MAIN DATA FEED LAYOUT CONTAINER */}
        {isLoading ? (
          <div className="bg-white border rounded-2xl py-32 text-center text-sm font-medium text-slate-400 animate-pulse">
            Querying cluster indices matching backend schema parameters...
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-6 text-sm font-semibold">
            Error loading operational logs: {error.message}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border rounded-2xl py-24 text-center space-y-2">
            <p className="text-slate-800 font-bold text-base">No Matching Entries Found</p>
            <p className="text-slate-400 text-xs">Try adjusting your tracking constraints or clear current text filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto relative">
              <table className="w-full text-sm text-left border-collapse min-w-[1200px]">
                <thead className="bg-slate-50/70 border-b text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer Details</th>
                    <th className="px-6 py-4 min-w-[280px]">Items Summary & Calculations</th>
                    <th className="px-6 py-4">Grand Total</th>
                    <th className="px-6 py-4">Timeline / Node</th>
                    <th className="px-6 py-4">Payment Status</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4 text-center sticky right-0 bg-slate-100 z-10 shadow-[inset_1px_0_0_rgba(226,232,240,1)] w-[200px]">Lifecycle Modification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map((order) => {
                    const currentSelectedStatus = selectedStatuses[order._id] || order.orderStatus;
                    const hasStatusChanged = currentSelectedStatus !== order.orderStatus;

                    return (
                      <tr key={order._id} className="hover:bg-slate-50/50 transition group">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                          {order._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-bold text-slate-900 capitalize">{order.user?.name || "Guest Account"}</p>
                          <p className="text-xs text-slate-400">{order.shippingAddress?.phone}</p>
                        </td>
                        
                        {/* ITEM SNAPSHOT CONSOLE WITH QUANTITY & SUBTOTAL INJECTION */}
                        <td className="px-6 py-4 min-w-[280px] max-w-xs">
                          <div className="divide-y divide-dashed divide-slate-100 space-y-1.5">
                            {(order.items || []).map((item) => (
                              <div key={item._id} className="text-xs py-1 flex flex-col space-y-0.5">
                                <div className="flex justify-between gap-2">
                                  <span className="font-bold text-slate-800 truncate max-w-[180px]">{item.title}</span>
                                  <span className="font-mono font-extrabold text-slate-900">₹{item.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 flex justify-between">
                                  <span>Quantity: <b className="text-slate-600 font-mono">{item.quantity}</b></span>
                                  <span>Unit: ₹{item.price?.toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 font-extrabold text-slate-900 whitespace-nowrap text-base">
                          ₹{order.totalAmount?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-xs text-slate-600 font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight mt-0.5">
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}
                          </p>
                        </td>
                        
                        {/* STATIC SEPARATED PAYMENT BADGE */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusClass(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </td>

                        {/* STATIC SEPARATED ORDER STATUS BADGE */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusClass(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>

                        {/* STICKY ACTIONS COLUMN — ONLY INTERACTIVE COMPONENT FOR FULFILLMENT LOGS */}
                        <td className="px-4 py-4 sticky right-0 bg-white group-hover:bg-slate-50 transition z-10 shadow-[inset_1px_0_0_rgba(226,232,240,1)] w-[200px] text-center">
                          <div className="flex items-center gap-1.5 justify-center">
                            <select
                              value={currentSelectedStatus}
                              onChange={(e) => handleDropdownLocalChange(order._id, e.target.value)}
                              className="border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold bg-white shadow-sm库 outline-none focus:ring-2 focus:ring-black cursor-pointer max-w-[115px]"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                            <button
                              onClick={() => handleStatusChangeSubmit(order._id, order.orderStatus)}
                              disabled={updateOrderStatusForAdmin.isPending}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition active:scale-95 ${
                                hasStatusChanged 
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 animate-pulse' 
                                  : 'bg-slate-900 text-white hover:bg-slate-800'
                              }`}
                            >
                              {updateOrderStatusForAdmin.isPending ? "..." : "Save"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* BACKEND BOUND PAGINATION TRACK BAR */}
            <div className="flex items-center justify-between px-2 py-2 text-sm font-medium text-slate-500">
              <span>Showing page <b>{currentPage}</b> of <b>{totalPages}</b></span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isRefetching}
                  className="p-2 border rounded-xl bg-white hover:bg-slate-50 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || isRefetching}
                  className="p-2 border rounded-xl bg-white hover:bg-slate-50 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}