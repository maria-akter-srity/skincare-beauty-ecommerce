import { Link } from "react-router-dom";
import { BRAND_NAME, BRAND_TAGLINE, FREE_SHIPPING_OVER } from "../config/brand";
import { money } from "../utils/format";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="flex items-center gap-2 text-xl font-bold text-emerald-800">
            <span className="text-2xl">🧴</span>
            {BRAND_NAME}
          </p>
          <p className="mt-3 max-w-sm text-sm text-stone-600">{BRAND_TAGLINE}.</p>
          <p className="mt-3 max-w-sm text-sm text-stone-500">
            Free shipping on orders over {money(FREE_SHIPPING_OVER)}. Secure card payments powered by Stripe.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-800">Shop</h3>
          <ul className="space-y-2 text-sm text-stone-600">
            <li>
              <Link to="/search" className="hover:text-emerald-700">All products</Link>
            </li>
            <li>
              <Link to="/search?skin=sensitive" className="hover:text-emerald-700">For sensitive skin</Link>
            </li>
            <li>
              <Link to="/search?concern=acne" className="hover:text-emerald-700">Acne care</Link>
            </li>
            <li>
              <Link to="/search?concern=sun%20protection" className="hover:text-emerald-700">Sun protection</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-800">Account</h3>
          <ul className="space-y-2 text-sm text-stone-600">
            <li>
              <Link to="/cart" className="hover:text-emerald-700">Your cart</Link>
            </li>
            <li>
              <Link to="/user/your-order" className="hover:text-emerald-700">Your orders</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-emerald-700">Sign in</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-emerald-700">Create account</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-100 px-4 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {BRAND_NAME}. Skincare advice on this site is general and not medical advice.
      </div>
    </footer>
  );
};

export default Footer;
