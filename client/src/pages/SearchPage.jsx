import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import FilterSidebar, { EMPTY_FILTERS } from "../components/Serach/FilterSidebar";
import ProductList from "../components/Serach/ProductList";
import { useSearch } from "../context/Serach";
import { getErrorMessage } from "../utils/apiError";
import { toast } from "react-toastify";

const SearchPage = () => {
  const [search, setSearch] = useSearch();
  const [params] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    skinTypes: params.get("skin") ? [params.get("skin")] : [],
    concerns: params.get("concern") ? [params.get("concern")] : [],
  }));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // When the footer / home links change ?skin= or ?concern=, follow them.
  const skinParam = params.get("skin");
  const concernParam = params.get("concern");
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      skinTypes: skinParam ? [skinParam] : f.skinTypes,
      concerns: concernParam ? [concernParam] : f.concerns,
    }));
  }, [skinParam, concernParam]);

  const keyword = search?.keyword || "";
  const keywordResults = search?.results;
  const hasFilters =
    filters.skinTypes.length ||
    filters.concerns.length ||
    filters.categories.length ||
    filters.radio.length;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const base = import.meta.env.VITE_BASE_URL;
        let list;
        if (hasFilters) {
          const { data } = await axios.post(`${base}/api/product/product-filters`, filters);
          list = data.products || [];
          if (keyword) {
            const ids = new Set((keywordResults || []).map((p) => p._id));
            list = list.filter((p) => ids.has(p._id));
          }
        } else if (keyword) {
          list = keywordResults || [];
        } else {
          const { data } = await axios.get(`${base}/api/product/get-all-product`);
          list = data.products || [];
        }
        if (!cancelled) setProducts(list);
      } catch (error) {
        if (!cancelled) {
          setProducts([]);
          toast.error(getErrorMessage(error, "Could not load products"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), keyword, keywordResults]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {keyword && (
        <div className="mb-4 flex items-center gap-2 text-sm text-stone-600">
          Showing results for
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">{keyword}</span>
          <button
            onClick={() => setSearch({ keyword: "", results: [] })}
            className="font-medium text-emerald-700 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar filters={filters} onChange={setFilters} />
        <ProductList products={products} loading={loading} title={keyword ? "Search results" : "Shop all products"} />
      </div>
    </div>
  );
};

export default SearchPage;
