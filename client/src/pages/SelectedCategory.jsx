import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { getErrorMessage } from "../utils/apiError";

const SelectedCategory = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/category/select-category/${slug}`
        );
        setCategory(data.category);
        setProducts(data.products || []);
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not load this category"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <p className="text-sm text-stone-500">
        <Link to="/" className="hover:text-emerald-700">Home</Link> / Category
      </p>
      <h1 className="mb-8 mt-2 text-3xl font-bold text-stone-900">{category?.name || "Category"}</h1>

      {loading ? (
        <p className="py-16 text-center text-stone-500">Loading products…</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center ring-1 ring-stone-200">
          <div className="text-5xl">🧴</div>
          <p className="mt-3 font-semibold text-stone-800">No products in this category yet</p>
          <Link to="/search" className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:underline">
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectedCategory;
