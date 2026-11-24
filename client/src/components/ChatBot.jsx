import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FaCommentDots, FaPaperPlane, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/UserContext";
import { BRAND_NAME } from "../config/brand";
import { money } from "../utils/format";

const SUGGESTIONS = [
  "I have oily skin with acne, what do you recommend?",
  "Best moisturizer for dry skin",
  "What do you sell?",
  "How do I place an order?",
];

const ChatBot = () => {
  const [auth] = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the ${BRAND_NAME} skincare assistant. Tell me your skin type or concern and I'll suggest products, or ask me how ordering works.`,
    },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  // No customer chat inside the admin panel.
  if (pathname.startsWith("/admin")) return null;

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/chat`,
        // Only role + content are sent, never the product cards.
        { messages: next.map(({ role, content }) => ({ role, content })) },
        { headers: auth?.token ? { Authorization: `Bearer ${auth.token}` } : {} }
      );
      setMessages([
        ...next,
        { role: "assistant", content: res.data.reply, products: res.data.products },
      ]);
    } catch (error) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "Sorry, I couldn't reach the assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Skincare assistant"
          className="fixed bottom-24 right-4 z-50 flex h-[34rem] max-h-[calc(100vh-8rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 sm:right-6"
        >
          <div className="flex items-center justify-between bg-emerald-700 px-4 py-3 text-white">
            <div>
              <p className="font-semibold leading-tight">{BRAND_NAME} Assistant</p>
              <p className="text-xs text-emerald-100">Skincare advice & product help</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded p-1 hover:bg-emerald-600"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50 p-3">
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-emerald-700 text-white"
                      : "bg-white text-stone-800 shadow-sm ring-1 ring-stone-200"
                  }`}
                >
                  {m.content}
                </div>

                {m.products?.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                    {m.products.map((p) => (
                      <Link
                        key={p._id}
                        to={`/product/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="w-40 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200 hover:shadow-md"
                      >
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-24 w-full object-cover" />
                        ) : (
                          <div className="flex h-24 w-full items-center justify-center bg-emerald-50 text-3xl">
                            🧴
                          </div>
                        )}
                        <div className="p-2">
                          <p className="truncate text-xs text-stone-500">{p.brand}</p>
                          <p className="truncate text-sm font-semibold text-stone-800">{p.name}</p>
                          <p className="mt-1 text-sm font-medium text-stone-700">
                            {money(p.price)}
                            {p.size ? <span className="text-xs text-stone-400"> · {p.size}</span> : null}
                          </p>
                          <p className={`text-xs font-medium ${p.inStock ? "text-emerald-600" : "text-red-500"}`}>
                            {p.inStock ? "In stock" : "Out of stock"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="w-fit rounded-2xl bg-white px-3 py-2 text-sm text-stone-500 shadow-sm ring-1 ring-stone-200">
                Typing…
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-emerald-700 bg-white px-3 py-1 text-left text-xs text-emerald-700 hover:bg-emerald-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 border-t bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skincare…"
              maxLength={1000}
              className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-black focus:border-emerald-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="rounded-lg bg-emerald-700 px-3 text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-2xl text-white shadow-lg hover:bg-emerald-800 sm:right-6"
      >
        {open ? <FaTimes /> : <FaCommentDots />}
      </button>
    </>
  );
};

export default ChatBot;
