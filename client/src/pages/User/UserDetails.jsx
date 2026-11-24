import { Link } from "react-router-dom";
import { useAuth } from "../../context/UserContext";

const UserDetails = () => {
  const [auth] = useAuth();
  const user = {
    name: auth?.user?.name || "N/A",
    email: auth?.user?.email || "N/A",
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="mb-6 text-2xl font-bold text-stone-800">My profile</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="w-24 font-semibold text-stone-800">Name:</span>
          <span className="text-stone-600">{user.name}</span>
        </div>
        <div className="flex items-center">
          <span className="w-24 font-semibold text-stone-800">Email:</span>
          <span className="text-stone-600">{user.email}</span>
        </div>
      </div>
      <Link
        to="/user/your-order"
        className="mt-8 inline-block rounded-full bg-emerald-700 px-6 py-2 text-white hover:bg-emerald-800"
      >
        View my orders
      </Link>
    </div>
  );
};

export default UserDetails;
