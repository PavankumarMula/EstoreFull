import MainLayout from "./layouts/MainLayout";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Signin";
import SignUpPage from "./pages/Signup";
import ProductDetailPage from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/checkOut";
import OrderDetailsPage from "./pages/OrderDetails";
import OrderHistoryPage from "./pages/OrderHistory";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path = "/checkout" element={<CheckoutPage />} />
        <Route path= "/order-success/:id" element={<OrderDetailsPage />} />
        <Route path= "/orders-history" element={<OrderHistoryPage />} /> 
      </Routes>
    </MainLayout>
  );
}

export default App;