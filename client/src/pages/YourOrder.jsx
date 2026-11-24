import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./User/Navbar";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/UserContext";
import { authHeader, getErrorMessage } from "../utils/apiError";
import { cap, formatDate, money } from "../utils/format";

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const YourOrder = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.token) return;
    const load = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/order/my-orders`,
          authHeader(auth)
        );
        setOrders(data.orders || []);
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not load your orders"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auth?.token]);

  return (
    <div className="flex flex-col bg-stone-50 lg:min-h-[70vh] lg:flex-row">
      <div className="w-full lg:w-64">
        <Navbar />
      </div>
      <div className="w-full flex-1 p-4 lg:p-8">
        <h1 className="mb-6 text-2xl font-bold text-stone-800">Your orders</h1>

        {loading ? (
          <Spinner />
        ) : orders.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-stone-600">You have not placed any orders yet.</p>
            <Link
              to="/search"
              className="mt-4 inline-block rounded-full bg-emerald-700 px-6 py-2 text-white hover:bg-emerald-800"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-5">
            {orders.map((order) => (
              <div key={order._id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <p className="text-sm text-stone-500">Placed on {formatDate(order.createdAt)}</p>
                    <p className="text-xs text-stone-400">Order {order._id}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[order.status] || "bg-stone-100 text-stone-600"}`}>
                    {cap(order.status)}
                  </span>
                </div>

                <ul className="divide-y divide-stone-100">
                  {order.items?.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 py-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-2xl">🧴</div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-stone-800">{item.name}</p>
                        <p className="text-sm text-stone-500">
                          {money(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-stone-800">{money(item.price * item.quantity)}</p>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-end justify-between gap-3 border-t border-stone-100 pt-3 text-sm">
                  <div className="text-stone-500">
                    <p className="font-medium text-stone-700">Ships to</p>
                    <p>{order.shippingAddress?.fullName}</p>
                    <p>
                      {order.shippingAddress?.line1}, {order.shippingAddress?.city}{" "}
                      {order.shippingAddress?.postalCode}
                    </p>
                  </div>
                  <div className="text-right text-stone-600">
                    <p>Subtotal: {money(order.subtotal)}</p>
                    <p>Shipping: {order.shippingFee ? money(order.shippingFee) : "Free"}</p>
                    <p className="text-base font-bold text-stone-800">Total: {money(order.total)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourOrder;
