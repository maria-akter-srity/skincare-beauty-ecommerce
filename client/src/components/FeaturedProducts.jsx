import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getErrorMessage } from "../utils/apiError";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta.env.VITE_BASE_URL;
        const popular = await axios.get(`${base}/api/product/popular-product`);
        let list = popular.data.products || [];
        // New store with no sales yet: fall back to all products.
        if (list.length === 0) {
          const all = await axios.get(`${base}/api/product/get-all-product`);
          list = (all.data.products || []).slice(0, 8);
        }
        setProducts(list);
      } catch (err) {
        setError(getErrorMessage(err, "Could not load products"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">Customer favourites</h2>
          <p className="mt-1 text-stone-600">Our most loved products right now.</p>
        </div>
        <Link to="/search" className="text-sm font-semibold text-emerald-700 hover:underline">
          View all →
        </Link>
      </div>

      {loading && <p className="py-10 text-center text-stone-500">Loading products…</p>}
      {error && <p className="py-10 text-center text-red-600">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="rounded-2xl bg-white py-10 text-center text-stone-500 ring-1 ring-stone-200">
          No products yet. Check back soon!
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
