import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../ProductCard";

const RelatedProduct = ({ productId, categoryId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!productId || !categoryId) return;
    const load = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/product/related-product/${productId}/${categoryId}`
        );
        setProducts(data.products || []);
      } catch (error) {
        console.error("Could not load related products:", error.message);
      }
    };
    load();
  }, [productId, categoryId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold text-stone-900">You may also like</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProduct;
