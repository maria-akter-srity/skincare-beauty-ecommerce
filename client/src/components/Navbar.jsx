import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { useAuth } from "../context/UserContext";
import { useCart } from "../context/Cart";
import { BRAND_NAME } from "../config/brand";
import SearchBar from "./Serach/SearchBar";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-emerald-700 ${
    isActive ? "text-emerald-700" : "text-stone-600"
  }`;

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const [, , cartApi] = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
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

  const closeAll = () => {
    setMenuOpen(false);
    setUserOpen(false);
    setCatOpen(false);
  };

  const goDashboard = () => {
    closeAll();
    navigate(auth?.user?.role === "admin" ? "/admin/details" : "/user");
  };

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
    closeAll();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" onClick={closeAll} className="flex items-center gap-2 text-xl font-bold text-emerald-800">
          <span className="text-2xl">🧴</span>
          {BRAND_NAME}
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 lg:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/search" className={linkClass}>
            Shop
          </NavLink>
          <div className="relative">
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-emerald-700"
            >
              Categories <FaChevronDown className="text-xs" />
            </button>
            {catOpen && (
              <>
                <button
                  aria-label="Close categories"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setCatOpen(false)}
                />
                <ul className="absolute left-0 z-50 mt-3 w-52 rounded-xl border border-stone-200 bg-white py-2 shadow-lg">
                  {categories.length === 0 && (
                    <li className="px-4 py-2 text-sm text-stone-400">No categories yet</li>
                  )}
                  {categories.map((c) => (
                    <li key={c._id}>
                      <Link
                        to={`/category/${c.slug}`}
                        onClick={closeAll}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-emerald-50"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <SearchBar className="hidden w-full max-w-xs md:flex" />

        <div className="flex items-center gap-4">
          <Link to="/cart" aria-label="Open cart" className="relative text-stone-700 hover:text-emerald-700" onClick={closeAll}>
            <FaShoppingBag size={20} />
            {cartApi.count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-400 px-1 text-xs font-bold text-white">
                {cartApi.count}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              aria-label="Account menu"
              onClick={() => setUserOpen((v) => !v)}
              className="text-stone-700 hover:text-emerald-700"
            >
              <FaUser size={20} />
            </button>
            {userOpen && (
              <>
                <button
                  aria-label="Close account menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setUserOpen(false)}
                />
                <ul className="absolute right-0 z-50 mt-3 w-52 rounded-xl border border-stone-200 bg-white py-2 shadow-lg">
                  {auth?.user && (
                    <li className="border-b border-stone-100 px-4 pb-2 text-xs text-stone-500">
                      Signed in as
                      <span className="block truncate text-sm font-medium text-stone-800">
                        {auth.user.name}
                      </span>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => (auth?.user ? goDashboard() : (closeAll(), navigate("/login")))}
                      className="block w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-emerald-50"
                    >
                      {auth?.user?.role === "admin" ? "Admin dashboard" : "Your profile"}
                    </button>
                  </li>
                  {auth?.user && auth.user.role !== "admin" && (
                    <li>
                      <button
                        onClick={() => (closeAll(), navigate("/user/your-order"))}
                        className="block w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-emerald-50"
                      >
                        My orders
                      </button>
                    </li>
                  )}
                  <li>
                    {auth?.user ? (
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-emerald-50"
                      >
                        Sign out
                      </button>
                    ) : (
                      <button
                        onClick={() => (closeAll(), navigate("/register"))}
                        className="block w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-emerald-50"
                      >
                        Create account
                      </button>
                    )}
                  </li>
                </ul>
              </>
            )}
          </div>

          <button
            className="text-stone-700 lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-stone-200 bg-white px-4 pb-4 pt-3 lg:hidden">
          <SearchBar className="mb-3 md:hidden" onDone={closeAll} />
          <ul className="space-y-1 text-stone-700">
            <li>
              <Link to="/" onClick={closeAll} className="block rounded-lg px-3 py-2 hover:bg-emerald-50">
                Home
              </Link>
            </li>
            <li>
              <Link to="/search" onClick={closeAll} className="block rounded-lg px-3 py-2 hover:bg-emerald-50">
                Shop all
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c._id}>
                <Link
                  to={`/category/${c.slug}`}
                  onClick={closeAll}
                  className="block rounded-lg px-3 py-2 pl-6 text-sm hover:bg-emerald-50"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
