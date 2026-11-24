import { Link } from "react-router-dom";

const TYPES = [
  { key: "oily", emoji: "💧", title: "Oily", text: "Lightweight, oil-balancing formulas", tone: "from-sky-50 to-emerald-50" },
  { key: "dry", emoji: "🌵", title: "Dry", text: "Rich hydration that lasts all day", tone: "from-amber-50 to-rose-50" },
  { key: "combination", emoji: "⚖️", title: "Combination", text: "Balance for T-zone and cheeks", tone: "from-emerald-50 to-lime-50" },
  { key: "sensitive", emoji: "🌸", title: "Sensitive", text: "Gentle care for easily irritated skin", tone: "from-rose-50 to-pink-50" },
  { key: "normal", emoji: "✨", title: "Normal", text: "Keep your skin happy and glowing", tone: "from-violet-50 to-rose-50" },
];

const ShopBySkinType = () => {
  return (
    <section id="skin-types" className="mx-auto mt-16 max-w-7xl scroll-mt-24 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-stone-900">Shop by skin type</h2>
        <p className="mt-2 text-stone-600">Not sure where to start? Pick the one that sounds like you.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {TYPES.map((t) => (
          <Link
            key={t.key}
            to={`/search?skin=${t.key}`}
            className={`group rounded-2xl bg-gradient-to-br ${t.tone} p-5 text-center ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="text-4xl transition group-hover:scale-110">{t.emoji}</div>
            <h3 className="mt-3 font-semibold text-stone-900">{t.title}</h3>
            <p className="mt-1 text-sm text-stone-600">{t.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopBySkinType;
