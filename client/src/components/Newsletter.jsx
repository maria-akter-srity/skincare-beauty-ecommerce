import { useState } from "react";
import { toast } from "react-toastify";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  // Demo only: there is no backend for this, we just confirm to the visitor.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thanks for subscribing! Your skincare tips are on the way.");
    setEmail("");
  };

  return (
    <section className="mx-auto mt-16 max-w-3xl px-4 text-center sm:px-6">
      <h2 className="text-3xl font-bold text-stone-900">Get skincare tips in your inbox</h2>
      <p className="mt-2 text-stone-600">Routines, ingredient guides and new arrivals. No spam.</p>
      <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 text-stone-900 outline-none focus:border-emerald-600"
        />
        <button
          type="submit"
          className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
