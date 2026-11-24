import React, { useState, useEffect, useRef } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/UserContext";
import { useCart } from "../context/Cart";
import { authHeader, getErrorMessage } from "../utils/apiError";
import { money, round2 } from "../utils/format";
import CheckoutForm from "./CheckoutForm";

// ISO country codes (Stripe needs the 2-letter code).
const COUNTRIES = [
  ["US", "United States"],
  ["CA", "Canada"],
  ["GB", "United Kingdom"],
  ["AU", "Australia"],
  ["IN", "India"],
  ["BD", "Bangladesh"],
  ["PK", "Pakistan"],
  ["AE", "United Arab Emirates"],
  ["SG", "Singapore"],
  ["MY", "Malaysia"],
  ["DE", "Germany"],
  ["FR", "France"],
  ["NL", "Netherlands"],
  ["IT", "Italy"],
  ["ES", "Spain"],
  ["SE", "Sweden"],
  ["JP", "Japan"],
  ["NZ", "New Zealand"],
];

const inputClass =
  "mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-emerald-600";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [cart, , cartApi] = useCart();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: auth?.user?.name || "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });
  // Totals shown to the customer. They start from the cart and are replaced by the
  // server's numbers if the server finds a different price (e.g. admin changed it).
  const [totals, setTotals] = useState({
    subtotal: cartApi.subtotal,
    shippingFee: cartApi.shippingFee,
    total: cartApi.total,
  });
  // Set once the card was charged, so a retry only re-saves the order and never charges twice.
  const paidRef = useRef(null);

  useEffect(() => {
    setTotals({
      subtotal: cartApi.subtotal,
      shippingFee: cartApi.shippingFee,
      total: cartApi.total,
    });
  }, [cartApi.subtotal, cartApi.shippingFee, cartApi.total]);

  // Guards: need a cart and a signed-in user.
  useEffect(() => {
    if (!auth?.token) {
      toast.info("Please sign in to check out");
      navigate("/login", { state: "/payment" });
    } else if (cart.length === 0 && !paidRef.current) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.token]);

  const handleChange = (e) =>
    setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  const items = cart.map((i) => ({ productId: i._id, quantity: i.quantity }));

  const saveOrder = async (paymentIntentId) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/order/create-order`,
      { items, shippingAddress: address, paymentIntentId },
      authHeader(auth)
    );
    cartApi.clear();
    toast.success("Order placed successfully!");
    navigate("/thank-you", { state: { order: data.order } });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Payment form is still loading. Please try again in a moment.");
      return;
    }
    const required = ["fullName", "phone", "line1", "city", "state", "postalCode", "country"];
    if (required.some((k) => !String(address[k]).trim())) {
      toast.error("Please fill out all the shipping fields.");
      return;
    }

    setLoading(true);
    try {
      // Card was already charged on an earlier try but saving the order failed: just retry saving.
      if (paidRef.current) {
        await saveOrder(paidRef.current);
        return;
      }

      const base = import.meta.env.VITE_BASE_URL;
      const { data } = await axios.post(
        `${base}/api/order/create-payment-intent`,
        { items, shippingAddress: address },
        authHeader(auth)
      );

      // The server prices the order from the database. If it differs from what the customer
      // saw, show the new total and let them confirm by pressing Pay again.
      if (Math.abs(round2(data.total) - round2(totals.total)) > 0.005) {
        setTotals({
          subtotal: data.subtotal,
          shippingFee: data.shippingFee,
          total: data.total,
        });
        toast.warn(`Prices were updated. Your new total is ${money(data.total)}. Please review and pay again.`);
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: address.fullName,
            phone: address.phone,
            address: {
              line1: address.line1,
              city: address.city,
              state: address.state,
              postal_code: address.postalCode,
              country: address.country,
            },
          },
        },
      });

      if (error) {
        toast.error(`Payment failed: ${error.message}`);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        paidRef.current = paymentIntent.id;
        try {
          await saveOrder(paymentIntent.id);
        } catch (err) {
          toast.error(
            `Your payment went through but we could not save the order (${getErrorMessage(err)}). ` +
              `Press Pay again to retry. Reference: ${paymentIntent.id}`,
            { autoClose: false }
          );
        }
      } else {
        toast.error("Payment was not completed. Please try again.");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not start the payment"));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !paidRef.current) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-stone-900">Checkout</h1>
      <form onSubmit={handlePayment} className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
            <h2 className="mb-4 text-lg font-bold text-stone-900">Shipping address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-stone-700 sm:col-span-2">
                Full name
                <input name="fullName" value={address.fullName} onChange={handleChange} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-stone-700 sm:col-span-2">
                Phone
                <input name="phone" value={address.phone} onChange={handleChange} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-stone-700 sm:col-span-2">
                Address
                <input name="line1" value={address.line1} onChange={handleChange} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-stone-700">
                City
                <input name="city" value={address.city} onChange={handleChange} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-stone-700">
                State / Region
                <input name="state" value={address.state} onChange={handleChange} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-stone-700">
                Postal code
                <input name="postalCode" value={address.postalCode} onChange={handleChange} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-stone-700">
                Country
                <select name="country" value={address.country} onChange={handleChange} className={inputClass}>
                  {COUNTRIES.map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
            <CheckoutForm total={totals.total} loading={loading} disabled={!stripe} />
          </section>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-stone-200 lg:col-span-2">
          <h2 className="text-lg font-bold text-stone-900">Order summary</h2>
          <ul className="mt-4 divide-y divide-stone-100">
            {cart.map((i) => (
              <li key={i._id} className="flex items-center gap-3 py-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-50 to-rose-50">
                  {i.image ? (
                    <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl">🧴</div>
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium text-stone-900">{i.name}</p>
                  <p className="text-stone-500">Qty {i.quantity}</p>
                </div>
                <p className="text-sm font-medium">{money(i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-600">Subtotal</dt>
              <dd>{money(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-600">Shipping</dt>
              <dd>{totals.shippingFee === 0 ? "Free" : money(totals.shippingFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-bold">
              <dt>Total</dt>
              <dd>{money(totals.total)}</dd>
            </div>
          </dl>
          <Link to="/cart" className="mt-4 block text-center text-sm font-medium text-emerald-700 hover:underline">
            Edit cart
          </Link>
        </aside>
      </form>
    </div>
  );
};

export default Payment;
