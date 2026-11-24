import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../../context/UserContext";
import { authHeader, getErrorMessage } from "../../utils/apiError";
import { formatDate } from "../../utils/format";

export const Stars = ({ value = 0, size = 16 }) => (
  <span className="inline-flex" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <FaStar key={n} size={size} className={n <= Math.round(value) ? "text-amber-400" : "text-stone-300"} />
    ))}
  </span>
);

const Reviews = ({ productId, onSummary }) => {
  const [auth] = useAuth();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!productId) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/review/${productId}`
      );
      setReviews(data.reviews || []);
      setAverage(data.average || 0);
      setCount(data.count || 0);
      onSummary?.({ average: data.average || 0, count: data.count || 0 });
    } catch (error) {
      console.error("Could not load reviews:", error.message);
    }
  }, [productId, onSummary]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a short comment");
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/review/${productId}`,
        { rating, comment: comment.trim() },
        authHeader(auth)
      );
      toast.success("Thanks for your review!");
      setComment("");
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save your review"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-stone-900">Customer reviews</h2>
      <div className="mt-2 flex items-center gap-3 text-stone-600">
        <Stars value={average} size={20} />
        <span>
          {count > 0 ? `${Number(average).toFixed(1)} out of 5 (${count} review${count === 1 ? "" : "s"})` : "No reviews yet"}
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="rounded-xl bg-white p-4 ring-1 ring-stone-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800">{r.user?.name || "Customer"}</span>
                <span className="text-xs text-stone-400">{formatDate(r.createdAt)}</span>
              </div>
              <Stars value={r.rating} size={14} />
              <p className="mt-2 whitespace-pre-wrap text-sm text-stone-600">{r.comment}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white p-5 ring-1 ring-stone-200 lg:self-start">
          <h3 className="font-semibold text-stone-900">Write a review</h3>
          {auth?.token ? (
            <form onSubmit={handleSubmit} className="mt-3">
              <div className="mb-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => setRating(n)}
                  >
                    <FaStar size={24} className={n <= rating ? "text-amber-400" : "text-stone-300"} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="How did this product work for your skin?"
                className="w-full rounded-lg border border-stone-300 bg-white p-3 text-sm text-stone-900 outline-none focus:border-emerald-600"
              />
              <button
                type="submit"
                disabled={saving}
                className="mt-3 rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Submit review"}
              </button>
              <p className="mt-2 text-xs text-stone-400">Posting again updates your previous review.</p>
            </form>
          ) : (
            <p className="mt-2 text-sm text-stone-600">
              Please{" "}
              <Link to="/login" state={window.location.pathname} className="font-medium text-emerald-700 hover:underline">
                sign in
              </Link>{" "}
              to write a review.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
