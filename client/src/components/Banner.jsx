import { Link } from "react-router-dom";
import { BRAND_NAME, BRAND_TAGLINE } from "../config/brand";

const Banner = () => {
  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-rose-50 ring-1 ring-stone-200">
        <div className="grid items-center gap-8 px-6 py-12 sm:px-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              New season essentials
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-stone-900 sm:text-5xl">
              Healthy skin starts with the <span className="text-emerald-700">right routine</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-stone-600">
              {BRAND_NAME}: {BRAND_TAGLINE.toLowerCase()}. Find products picked for your skin type and your concerns.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/search"
                className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Shop now
              </Link>
              <a
                href="#skin-types"
                className="rounded-full bg-white px-6 py-3 font-semibold text-emerald-800 ring-1 ring-emerald-700 transition hover:bg-emerald-50"
              >
                Shop by skin type
              </a>
            </div>
          </div>

          {/* Illustration made from gradients and emoji (no image files needed) */}
          <div className="relative mx-auto hidden h-72 w-72 md:block lg:h-80 lg:w-80" aria-hidden="true">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-200 to-emerald-200 opacity-70 blur-2xl" />
            <div className="absolute inset-6 flex items-center justify-center rounded-full bg-white/80 text-8xl shadow-inner ring-1 ring-stone-200">
              🧴
            </div>
            <span className="absolute left-0 top-6 text-4xl">🌿</span>
            <span className="absolute right-2 top-0 text-4xl">✨</span>
            <span className="absolute bottom-4 left-4 text-4xl">💧</span>
            <span className="absolute bottom-0 right-6 text-4xl">☀️</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
