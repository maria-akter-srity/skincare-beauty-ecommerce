import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { money } from "../utils/format";

const ThankYou = () => {
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const order = useLocation().state?.order;

  useEffect(() => {
    const t = setTimeout(() => setShowMessage(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-emerald-50 via-stone-50 to-rose-50 px-4 py-16">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        run={showMessage}
        numberOfPieces={150}
        recycle={false}
      />
      <div className="relative z-10 mx-auto max-w-lg rounded-2xl bg-white p-10 text-center shadow-lg">
        <div className="text-5xl">🌿</div>
        <h1
          className={`mt-4 text-3xl font-bold text-stone-800 transition duration-1000 ${
            showMessage ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Thank you for your order!
        </h1>
        <p className="mt-3 text-stone-600">
          {order
            ? `Your payment of ${money(order.total)} went through. We will start packing your skincare soon.`
            : "We appreciate your support. Your order is on its way to being packed."}
        </p>
        {order?._id && (
          <p className="mt-2 text-xs text-stone-400">Order ID: {order._id}</p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/user/your-order"
            className="rounded-full bg-emerald-700 px-6 py-2.5 font-medium text-white hover:bg-emerald-800"
          >
            View my orders
          </Link>
          <button
            onClick={() => navigate("/")}
            className="rounded-full border border-stone-300 px-6 py-2.5 font-medium text-stone-700 hover:bg-stone-50"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
