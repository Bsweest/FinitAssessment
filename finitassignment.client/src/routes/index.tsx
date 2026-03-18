import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "../components/products/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { queryProducts } from "../client/sdk.gen";
import { throwErrorMessage } from "../utils";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [queryProducts.name],
    queryFn: async ({ signal }) => {
      const { data, error } = await queryProducts({ signal });
      if (error) throwErrorMessage(error);
      return data;
    },
  });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const categories = useMemo(() => {
    return ["All", "Decor", "Stationery", "Kitchen"];
  }, []);

  return (
    <div
      className="min-h-screen bg-[#0f0e0c] text-[#f0ece4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f0e0c; }
        ::-webkit-scrollbar-thumb { background: #3a3830; border-radius: 2px; }
      `}</style>

      {/* ── Header ── */}
      <header
        className="px-10 py-7 flex items-end justify-between border-b border-[#1e1d1a]"
        style={{ animation: "fadeDown 0.6s ease both" }}
      >
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#b8965a] mb-1">
            Manh. Phan Huy's
          </p>
          <h1 className="font-serif text-3xl tracking-tight leading-none">
            Product Catalog
          </h1>
        </div>
      </header>

      {/* ── Filter Bar ── */}
      <div
        className="px-10 py-4 flex flex-wrap items-center gap-3 border-b border-[#1e1d1a]"
        style={{ animation: "fadeDown 0.6s 0.1s ease both" }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#4a4740] mr-1">
          Filter
        </span>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 text-xs border transition-all duration-200"
            style={{
              borderColor: activeCategory === cat ? "#b8965a" : "#2e2c28",
              color: activeCategory === cat ? "#b8965a" : "#7a7670",
              background:
                activeCategory === cat
                  ? "rgba(184,150,90,0.08)"
                  : "transparent",
              letterSpacing: "0.08em",
            }}
          >
            {cat}
          </button>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 text-xs border border-[#2e2c28] bg-[#1a1916] text-[#7a7670] outline-none cursor-pointer"
          style={{ letterSpacing: "0.06em" }}
        >
          <option value="default">Default</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="name">Name A–Z</option>
        </select>

        {/* Search */}
        <div className="relative flex flex-row items-center gap-2">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4740] pointer-events-none"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-1.5 text-xs border border-[#2e2c28] bg-[#1a1916] text-[#f0ece4] placeholder-[#4a4740] outline-none w-44 focus:border-[#b8965a] transition-colors duration-200"
            style={{ letterSpacing: "0.04em" }}
          />
          <button onClick={() => refetch()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Grid / List ── */}
      <main className="px-10 py-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="flex flex-col">
            <h1>Error happened:</h1>
            <p className="text-red">{error.message}</p>;
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-[#3a3830]">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <p className="text-sm tracking-widest uppercase">
              No products found
            </p>
          </div>
        ) : (
          <div
            className="grid gap-px"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            }}
          >
            {data.map((product, i) => (
              <ProductCard key={product.id} {...product} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
