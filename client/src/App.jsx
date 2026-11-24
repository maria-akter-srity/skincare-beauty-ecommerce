import { Route, Routes } from "react-router-dom";
import Advertisement from "./components/Advertisement";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import ThankYou from "./components/ThankYou";
import PrivateRoute from "./components/Routes/Admin";
import UserRoutes from "./components/Routes/Private";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProductDetails from "./pages/ProductDetails";
import SelectedCategory from "./pages/SelectedCategory";
import CartPage from "./pages/CartPage";
import Payment from "./pages/Payment";
import YourOrder from "./pages/YourOrder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/User/UserDashboard";


function App() {
  return (
    <>
      <Advertisement />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/category/:slug" element={<SelectedCategory />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Logged-in customer pages */}
        <Route path="/user" element={<UserRoutes />}>
          <Route path="" element={<UserDashboard />} />
          <Route path="your-order" element={<YourOrder />} />
        </Route>

        {/* Admin pages (protected on the server too) */}
       
      </Routes>
      <Footer />
      
    </>
  );
}

export default App;
