import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/UserContext.jsx";
import { SearchProvider } from "./context/Serach.jsx";
import { CartProvider } from "./context/Cart.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Stripe publishable key (safe to expose). Set VITE_STRIPE_PUBLISHABLE_KEY in client/.env to use your own.
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51NmvjYSJMmMS2PKYPTmToXg9wC1zicQF8uOorOJ0BcYOioztEhncFCsEE3NfcBEjr7XqJhzCldWd0RfK0tUHZ3mW00ISvW0iwa"
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <CartProvider>
          <SearchProvider>
            <BrowserRouter>
              <App />
              <ToastContainer position="top-right" autoClose={2500} />
            </BrowserRouter>
          </SearchProvider>
        </CartProvider>
      </Elements>
    </AuthProvider>
  </StrictMode>
);
