import React from "react";
import ProductCard from "../ProductCard";

const ProductList = ({ products, loading, title }) => {
  return (
    <div className="flex-1">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">
        {title || "Shop all products"}
        {!loading && <span className="ml-2 text-base font-normal text-stone-500">({products.length})</span>}
      </h1>

      {loading ? (
        <p className="py-16 text-center text-stone-500">Loading products…</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center ring-1 ring-stone-200">
          <div className="text-5xl">🔍</div>
          <p className="mt-3 font-semibold text-stone-800">No products found</p>
          <p className="text-sm text-stone-500">Try removing a filter or searching for something else.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
