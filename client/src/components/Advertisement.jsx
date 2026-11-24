import { FREE_SHIPPING_OVER } from "../config/brand";
import { money } from "../utils/format";

// Slim promo strip shown above the navbar.
const Advertisement = () => (
  <div className="bg-emerald-800 px-4 py-2 text-center text-sm text-emerald-50">
    ✨ Free shipping on orders over {money(FREE_SHIPPING_OVER)} ✨
  </div>
);

export default Advertisement;
