import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import RelatedProduct from "./RelatedProduct";
import Reviews, { Stars } from "./Reviews";
import Spinner from "../Spinner";
import { useCart } from "../../context/Cart";
import { money, stockInfo, cap } from "../../utils/format";

const Chip = ({ children, tone = "bg-emerald-50 text-emerald-800" }) => (
  <span className={`rounded-full px-3 py-1 text-sm ${tone}`}>{children}</span>
);

const Product = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [, , cartApi] = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [summary, setSummary] = useState({ average: 0, count: 0 });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setImageIndex(0);
      setQty(1);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/product/get-product/${slug}`
        );
        if (data.product) setProduct(data.product);
        else setNotFound(true);
      } catch (error) {
        console.error("Error fetching product:", error.message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  const onSummary = useCallback((s) => setSummary(s), []);

  if (loading) return <Spinner />;
  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="text-6xl">🧴</div>
        <h1 className="mt-4 text-2xl font-bold text-stone-900">Product not found</h1>
        <Link to="/search" className="mt-4 inline-block font-medium text-emerald-700 hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const stock = stockInfo(product.stock);
  const soldOut = !(product.stock > 0);
  const images = product.images || [];
  const categoryId = product.category?._id || product.category;

  const handleAdd = () => {
    if (cartApi.add(product, qty)) {
      toast.success(`${product.name} added to cart`);
      return true;
    }
    toast.info(soldOut ? "This product is out of stock" : "You already have all available stock in your cart");
    return false;
  };

  const handleBuyNow = () => {
    // Even if the cart is already at the stock limit, go to the cart.
    handleAdd();
    navigate("/cart");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <p className="mb-6 text-sm text-stone-500">
        <Link to="/" className="hover:text-emerald-700">Home</Link> /{" "}
        {product.category?.slug ? (
          <Link to={`/category/${product.category.slug}`} className="hover:text-emerald-700">
            {product.category.name}
          </Link>
        ) : (
          "Shop"
        )}{" "}
        / {product.name}
      </p>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-rose-50 ring-1 ring-stone-200">
            {images[imageIndex] ? (
              <img src={images[imageIndex]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-9xl">🧴</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setImageIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`h-20 w-20 overflow-hidden rounded-xl ring-2 ${
                    i === imageIndex ? "ring-emerald-600" : "ring-stone-200"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{product.brand}</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Stars value={summary.average} size={18} />
            <span className="text-sm text-stone-500">
              {summary.count > 0 ? `${Number(summary.average).toFixed(1)} (${summary.count})` : "No reviews yet"}
            </span>
          </div>

          <p className="mt-5 text-3xl font-bold text-stone-900">{money(product.price)}</p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className={`rounded-full px-3 py-1 font-medium ${stock.tone}`}>{stock.label}</span>
            {product.size && <span className="text-stone-500">Size: {product.size}</span>}
          </div>

          <p className="mt-6 whitespace-pre-line text-stone-600">{product.description}</p>

          {/* Quantity + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full ring-1 ring-stone-300">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={soldOut}
                aria-label="Decrease quantity"
                className="h-10 w-10 text-xl text-stone-700 disabled:opacity-40"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold">{soldOut ? 0 : qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={soldOut || qty >= product.stock}
                aria-label="Increase quantity"
                className="h-10 w-10 text-xl text-stone-700 disabled:opacity-40"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={soldOut}
              className="rounded-full bg-emerald-700 px-7 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {soldOut ? "Out of stock" : "Add to cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={soldOut}
              className="rounded-full bg-white px-7 py-3 font-semibold text-emerald-800 ring-1 ring-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy now
            </button>
          </div>

          {/* Details */}
          <div className="mt-10 space-y-6">
            {product.skinTypes?.length > 0 && (
              <div>
                <h2 className="mb-2 font-semibold text-stone-900">Best for skin type</h2>
                <div className="flex flex-wrap gap-2">
                  {product.skinTypes.map((t) => (
                    <Chip key={t}>{t === "all" ? "All skin types" : cap(t)}</Chip>
                  ))}
                </div>
              </div>
            )}
            {product.concerns?.length > 0 && (
              <div>
                <h2 className="mb-2 font-semibold text-stone-900">Helps with</h2>
                <div className="flex flex-wrap gap-2">
                  {product.concerns.map((c) => (
                    <Chip key={c} tone="bg-rose-50 text-rose-700">{cap(c)}</Chip>
                  ))}
                </div>
              </div>
            )}
            {product.ingredients?.length > 0 && (
              <div>
                <h2 className="mb-2 font-semibold text-stone-900">Ingredients</h2>
                <p className="text-sm text-stone-600">{product.ingredients.join(", ")}</p>
              </div>
            )}
            {product.howToUse && (
              <div>
                <h2 className="mb-2 font-semibold text-stone-900">How to use</h2>
                <p className="whitespace-pre-line text-sm text-stone-600">{product.howToUse}</p>
              </div>
            )}
            <p className="rounded-xl bg-stone-100 p-3 text-xs text-stone-500">
              Tip: patch-test new products on a small area of skin first. If you have a skin condition or allergies,
              check with a dermatologist.
            </p>
          </div>
        </div>
      </div>

      <Reviews productId={product._id} onSummary={onSummary} />
      <RelatedProduct productId={product._id} categoryId={categoryId} />
    </div>
  );
};

export default Product;
