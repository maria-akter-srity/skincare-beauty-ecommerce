import { FaUser, FaBoxOpen } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const navbarMenu = [
  { id: 1, name: "My Profile", link: "/user", icon: <FaUser /> },
  { id: 2, name: "My Orders", link: "/user/your-order", icon: <FaBoxOpen /> },
];

const Navbar = () => {
  const { pathname } = useLocation();
  return (
    <div className="h-full border-b border-stone-200 bg-white lg:min-h-[28rem] lg:border-b-0 lg:border-r">
      <nav className="flex gap-2 p-3 lg:flex-col lg:p-5">
        {navbarMenu.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className={`flex items-center rounded-lg p-3 transition-colors ${
              pathname === item.link
                ? "bg-emerald-700 text-white"
                : "text-stone-700 hover:bg-emerald-50"
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
