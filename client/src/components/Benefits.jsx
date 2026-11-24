import { FREE_SHIPPING_OVER } from "../config/brand";
import { money } from "../utils/format";

const ITEMS = [
  { emoji: "🌿", title: "Skin-friendly ingredients", text: "Every product lists its full ingredients so you know what goes on your skin." },
  { emoji: "🔍", title: "Find your match", text: "Filter by skin type and concern, or ask our assistant for a suggestion." },
  { emoji: "🚚", title: `Free shipping over ${money(FREE_SHIPPING_OVER)}`, text: "A flat low rate on smaller orders and free delivery on bigger ones." },
  { emoji: "🔒", title: "Secure checkout", text: "Card payments are handled by Stripe. We never see your card details." },
];

const Benefits = () => (
  <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
    <div className="rounded-3xl bg-emerald-800 px-6 py-12 text-white sm:px-12">
      <h2 className="text-center text-3xl font-bold">Why you'll love shopping here</h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((i) => (
          <div key={i.title} className="text-center">
            <div className="text-4xl">{i.emoji}</div>
            <h3 className="mt-3 font-semibold">{i.title}</h3>
            <p className="mt-1 text-sm text-emerald-100">{i.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;
