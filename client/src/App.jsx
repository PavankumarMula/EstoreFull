import MainLayout from "./layouts/MainLayout";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Signin";
import SignUpPage from "./pages/Signup";
import ProductDetailPage from "./pages/ProductDetail";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;