import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const EMOJIS = ["🧴", "🌿", "💧", "☀️", "🌸", "✨", "🧼", "🍃"];

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/category/get-category`
        );
        setCategories(data.category || []);
      } catch (error) {
        console.error("Could not load categories:", error.message);
      }
    };
    load();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      <h2 className="mb-8 text-center text-3xl font-bold text-stone-900">Shop by category</h2>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
        {categories.map((c, i) => (
          <Link
            key={c._id}
            to={`/category/${c.slug}`}
            className="flex min-w-[10rem] items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200 transition hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-2xl">
              {EMOJIS[i % EMOJIS.length]}
            </span>
            <span className="font-semibold text-stone-800">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
