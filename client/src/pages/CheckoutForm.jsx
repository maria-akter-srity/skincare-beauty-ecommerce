import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { money } from "../utils/format";

// Card box + pay button. It lives inside the <form> in Payment.jsx,
// so pressing the button submits that form.
const CARD_STYLE = {
  style: {
    base: {
      fontSize: "16px",
      color: "#292524",
      "::placeholder": { color: "#a8a29e" },
    },
    invalid: { color: "#dc2626" },
  },
  hidePostalCode: true,
};

const CheckoutForm = ({ total, loading, disabled }) => {
  return (
    <div>
      <h2 className="mb-3 text-lg font-bold text-stone-900">Payment</h2>
      <div className="rounded-xl border border-stone-300 bg-white p-4">
        <CardElement options={CARD_STYLE} />
      </div>
      <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Demo store: use test card <strong>4242 4242 4242 4242</strong>, any future expiry date and any 3-digit CVC.
      </p>
      <button
        type="submit"
        disabled={loading || disabled}
        className="mt-5 w-full rounded-full bg-emerald-700 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Processing…" : `Pay ${money(total)}`}
      </button>
    </div>
  );
};

export default CheckoutForm;
