import Navbar from "./Navbar";
import UserDetails from "./UserDetails";

const UserDashboard = () => {
  return (
    <div className="flex min-h-[60vh] items-start justify-center bg-stone-50 p-4 lg:p-10">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-100 lg:flex-row">
        <div className="lg:w-64">
          <Navbar />
        </div>
        <UserDetails />
      </div>
    </div>
  );
};

export default UserDashboard;
