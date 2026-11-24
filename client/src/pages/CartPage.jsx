import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/UserContext";
import { useCart } from "../context/Cart";
import { FREE_SHIPPING_OVER } from "../config/brand";
import { money } from "../utils/format";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, , cartApi] = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!cart.length) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!auth?.token) {
      toast.info("Please sign in to continue to checkout");
      return navigate("/login", { state: "/payment" });
    }
    navigate("/payment");
  };

  const remaining = Math.max(0, FREE_SHIPPING_OVER - cartApi.subtotal);
  const progress = Math.min(100, (cartApi.subtotal / FREE_SHIPPING_OVER) * 100);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="text-6xl">🛍️</div>
        <h1 className="mt-4 text-2xl font-bold text-stone-900">Your cart is empty</h1>
        <p className="mt-2 text-stone-600">Find something your skin will love.</p>
        <Link
          to="/search"
          className="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-stone-900">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <div key={item._id} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-stone-200">
              <Link
                to={`/product/${item.slug}`}
                className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-rose-50"
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl">🧴</div>
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{item.brand}</p>
                    <Link to={`/product/${item.slug}`} className="font-semibold text-stone-900 hover:text-emerald-700">
                      {item.name}
                    </Link>
                    {item.size && <p className="text-sm text-stone-500">{item.size}</p>}
                  </div>
                  <p className="font-semibold text-stone-900">{money(item.price * item.quantity)}</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full ring-1 ring-stone-300">
                    <button
                      onClick={() => cartApi.setQty(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="h-8 w-8 text-lg disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => cartApi.setQty(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                      className="h-8 w-8 text-lg disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => cartApi.remove(item._id)}
                    className="flex items-center gap-1 text-sm text-stone-500 hover:text-red-600"
                  >
                    <FaTrashAlt /> Remove
                  </button>
                </div>
                {item.quantity >= item.stock && (
                  <p className="mt-1 text-xs text-amber-600">Maximum available quantity</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-stone-200">
          <h2 className="text-xl font-bold text-stone-900">Order summary</h2>

          <div className="mt-4">
            <p className="text-sm text-stone-600">
              {remaining > 0
                ? `Add ${money(remaining)} more for free shipping`
                : "You've unlocked free shipping 🎉"}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
              <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-600">Subtotal ({cartApi.count} items)</dt>
              <dd className="font-medium">{money(cartApi.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-600">Shipping</dt>
              <dd className="font-medium">{cartApi.shippingFee === 0 ? "Free" : money(cartApi.shippingFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-bold">{money(cartApi.total)}</dd>
            </div>
          </dl>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full rounded-full bg-emerald-700 py-3 font-semibold text-white transition hover:bg-emerald-800"
          >
            Proceed to checkout
          </button>
          <Link to="/search" className="mt-3 block text-center text-sm font-medium text-emerald-700 hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
