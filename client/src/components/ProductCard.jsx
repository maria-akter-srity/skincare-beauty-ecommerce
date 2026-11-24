import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/Cart";
import { money, stockInfo } from "../utils/format";

const ProductCard = ({ product }) => {
  const [, , cartApi] = useCart();
  if (!product) return null;

  const stock = stockInfo(product.stock);
  const soldOut = !(product.stock > 0);
  const image = product.images?.[0];

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartApi.add(product, 1)) {
      toast.success(`${product.name} added to cart`);
    } else {
      toast.info(soldOut ? "This product is out of stock" : "You have all available stock in your cart");
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:shadow-md">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-emerald-50 to-rose-50">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">🧴</div>
          )}
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${stock.tone}`}
          >
            {stock.label}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
          {product.brand}
        </p>
        <Link
          to={`/product/${product.slug}`}
          className="mt-1 line-clamp-2 font-semibold text-stone-800 hover:text-emerald-700"
        >
          {product.name}
        </Link>
        {product.size && <p className="mt-0.5 text-sm text-stone-500">{product.size}</p>}

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-stone-900">{money(product.price)}</span>
          <button
            onClick={handleAdd}
            disabled={soldOut}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <FaShoppingBag />
            {soldOut ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
