import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { useSearch } from "../../context/Serach";
import { getErrorMessage } from "../../utils/apiError";

// Keyword search box. Stores the results in the search context and opens /search.
const SearchBar = ({ className = "", onDone }) => {
  const [search, setSearch] = useSearch();
  const [value, setValue] = useState(search?.keyword || "");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const keyword = value.trim();
    if (!keyword) {
      setSearch({ keyword: "", results: [] });
      navigate("/search");
      onDone?.();
      return;
    }
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/product/search/${encodeURIComponent(keyword)}`
      );
      setSearch({ keyword, results: data.products || [] });
      navigate("/search");
      onDone?.();
    } catch (error) {
      toast.error(getErrorMessage(error, "Search failed"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center rounded-full bg-stone-100 px-4 py-2 ring-1 ring-stone-200 focus-within:ring-emerald-600 ${className}`}
    >
      <FaSearch className="mr-2 shrink-0 text-stone-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search serums, cleansers, SPF…"
        className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
      />
    </form>
  );
};

export default SearchBar;
