import MainLayout from "./layouts/MainLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Signin";
import SignUpPage from "./pages/Signup";
import ProductDetailPage from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/checkOut";
import OrderDetailsPage from "./pages/OrderDetails";
import OrderHistoryPage from "./pages/OrderHistory";
import AdminDashboard from "./pages/AdminPage";
import {useAuth} from "./contexts/authContext";

function App() {
  const { user, isAuthenticated } = useAuth();
  const role = user?.user?.role;
  console.log("User Role in App.jsx:", user);
  const isAdmin = isAuthenticated && role === "admin";

  return (
    <MainLayout>
      <Routes>
        {/* =========================================================
            ADMIN PRIVILEGED ROUTES
           ========================================================= */}
        {isAdmin ? (
          <>
            {/* Base Admin view route mapping hook */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Fallback Catch-all: If an admin hits ANY other route, 
                seamlessly redirect them back to safety on the dashboard */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          /* =========================================================
             STANDARD CUSTOMER & GUEST ROUTES
             ========================================================= */
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:id" element={<OrderDetailsPage />} />
            <Route path="/orders-history" element={<OrderHistoryPage />} />
            
            {/* Safe 404 Fallback for ordinary clients */}
            <Route path="*" element={<div className="container py-20 text-center text-xl font-bold">404 Not Found</div>} />
          </>
        )}
      </Routes>
    </MainLayout>
  );
}

export default App;