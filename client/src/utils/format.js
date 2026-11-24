import { FREE_SHIPPING_OVER, FLAT_SHIPPING } from "../config/brand";

export const money = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

export const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

// Same rule as the server: subtotal >= FREE_SHIPPING_OVER ships free.
export const shippingFor = (subtotal) =>
  subtotal <= 0 ? 0 : subtotal >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING;

export const stockInfo = (stock) => {
  const n = Number(stock) || 0;
  if (n <= 0) return { label: "Out of stock", tone: "bg-red-100 text-red-700" };
  if (n <= 5) return { label: `Only ${n} left`, tone: "bg-amber-100 text-amber-700" };
  return { label: "In stock", tone: "bg-emerald-100 text-emerald-700" };
};

export const cap = (s) =>
  typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s;

export const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
