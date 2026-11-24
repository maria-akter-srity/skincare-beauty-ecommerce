import {
  useState,
  useContext,
  createContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { round2, shippingFor } from "../utils/format";

const CartContext = createContext();

// Read the saved cart. Drops anything that is not a valid shop item
// (for example old items saved by the previous version of the site).
const loadCart = () => {
  try {
    const raw = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (i) =>
        i &&
        i._id &&
        typeof i.name === "string" &&
        typeof i.price === "number" &&
        Number.isInteger(i.quantity) &&
        i.quantity > 0
    );
  } catch {
    return [];
  }
};

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      /* storage unavailable: cart still works in memory */
    }
  }, [cart]);

  // product: an API product ({_id, slug, name, brand, price, images, size, stock}).
  // Returns true if something was added, false if out of stock or already at the stock limit.
  const add = useCallback((product, qty = 1) => {
    if (!product?._id) return false;
    const stock = Number(product.stock) || 0;
    if (stock <= 0) return false;
    let added = false;
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + qty, stock);
        if (nextQty === existing.quantity) return prev;
        added = true;
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: nextQty, stock } : i
        );
      }
      added = true;
      return [
        ...prev,
        {
          _id: product._id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          price: Number(product.price) || 0,
          image: product.image || product.images?.[0] || "",
          size: product.size || "",
          stock,
          quantity: Math.min(Math.max(1, qty), stock),
        },
      ];
    });
    return added;
  }, []);

  const setQty = useCallback((id, qty) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === id
          ? { ...i, quantity: Math.min(Math.max(1, qty), i.stock || 1) }
          : i
      )
    );
  }, []);

  const remove = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const cartApi = useMemo(() => {
    const count = cart.reduce((n, i) => n + i.quantity, 0);
    const subtotal = round2(cart.reduce((s, i) => s + i.price * i.quantity, 0));
    const shippingFee = shippingFor(subtotal);
    return {
      add,
      setQty,
      remove,
      clear,
      count,
      subtotal,
      shippingFee,
      total: round2(subtotal + shippingFee),
    };
  }, [cart, add, setQty, remove, clear]);

  return (
    <CartContext.Provider value={[cart, setCart, cartApi]}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook: const [cart, setCart, cartApi] = useCart();
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
