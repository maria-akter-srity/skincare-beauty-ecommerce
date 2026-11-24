import { useEffect, useState } from "react";
import axios from "axios";
import { SKIN_TYPES, CONCERNS } from "../../config/brand";
import { cap } from "../../utils/format";

export const PRICE_RANGES = [
  { label: "Any price", value: [] },
  { label: "Under $15", value: [0, 15] },
  { label: "$15 – $30", value: [15, 30] },
  { label: "$30 – $60", value: [30, 60] },
  { label: "$60 & above", value: [60, 100000] },
];

export const EMPTY_FILTERS = { skinTypes: [], concerns: [], categories: [], radio: [] };

const toggle = (list, value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

// Controlled filter panel: the page owns `filters` and gets every change through onChange.
const FilterSidebar = ({ filters, onChange }) => {
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

  const set = (patch) => onChange({ ...filters, ...patch });
  const activeCount =
    filters.skinTypes.length +
    filters.concerns.length +
    filters.categories.length +
    (filters.radio.length ? 1 : 0);

  const checkbox = (checked, onToggle, label) => (
    <label key={label} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-stone-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-4 w-4 rounded border-stone-300 accent-emerald-700"
      />
      {label}
    </label>
  );

  return (
    <aside className="w-full shrink-0 rounded-2xl bg-white p-5 ring-1 ring-stone-200 lg:w-64">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-stone-900">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-stone-500">Skin type</h3>
      <div className="mb-5">
        {SKIN_TYPES.filter((t) => t !== "all").map((t) =>
          checkbox(
            filters.skinTypes.includes(t),
            () => set({ skinTypes: toggle(filters.skinTypes, t) }),
            cap(t)
          )
        )}
      </div>

      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-stone-500">Concern</h3>
      <div className="mb-5">
        {CONCERNS.map((c) =>
          checkbox(
            filters.concerns.includes(c),
            () => set({ concerns: toggle(filters.concerns, c) }),
            cap(c)
          )
        )}
      </div>

      {categories.length > 0 && (
        <>
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-stone-500">Category</h3>
          <div className="mb-5">
            {categories.map((c) =>
              checkbox(
                filters.categories.includes(c._id),
                () => set({ categories: toggle(filters.categories, c._id) }),
                c.name
              )
            )}
          </div>
        </>
      )}

      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-stone-500">Price</h3>
      <div>
        {PRICE_RANGES.map((r) => (
          <label key={r.label} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-stone-700">
            <input
              type="radio"
              name="price"
              checked={JSON.stringify(filters.radio) === JSON.stringify(r.value)}
              onChange={() => set({ radio: r.value })}
              className="h-4 w-4 border-stone-300 accent-emerald-700"
            />
            {r.label}
          </label>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
