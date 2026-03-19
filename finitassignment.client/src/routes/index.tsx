import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryCategories, queryProducts } from "../client/sdk.gen";
import { throwErrorMessage } from "../utils";
import { ProductList } from "../components/products/ProductList";
import PriceRangeFilter from "../components/products/PriceRangeFilter";
import { useDebounce } from "@uidotdev/usehooks";
import Paginate from "../components/products/Paginate";
import { CreateProductButton } from "../components/products/CreateProductButton";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | undefined>();
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(500);

  const queryKey = useDebounce(
    [queryProducts.name, page, search, low, high, activeCategory],
    500,
  );

  const { data, error, refetch } = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const { data, error } = await queryProducts({
        signal,
        query: {
          page,
          category: activeCategory,
          description: search,
          maxPrice: high,
          minPrice: low,
        },
      });
      if (error) throwErrorMessage(error);
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: [queryCategories.name],
    queryFn: async ({ signal }) => {
      const { data, error } = await queryCategories({ signal });
      if (error) throwErrorMessage(error);
      return data;
    },
    placeholderData: [],
  });

  const categoryFilter = useMemo(() => {
    return [
      { label: "All", value: undefined },
      ...(categories ?? []).map((it) => ({ label: it.name, value: it.id })),
    ];
  }, [categories]);

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
      <div className="flex flex-row justify-end px-10 pt-2">
        <CreateProductButton />
      </div>

      {/* ── Filter Bar ── */}
      <div
        className="px-10 py-4 flex flex-row justify-between gap-3 border-b border-[#1e1d1a]"
        style={{ animation: "fadeDown 0.6s 0.1s ease both" }}
      >
        <div className="flex flex-col items-start gap-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#4a4740] mr-1">
            Filter
          </p>
          <div className="flex-row flex-wrap">
            {categoryFilter.map(({ label, value }, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(value)}
                className="px-4 py-1.5 text-xs border transition-all duration-200"
                style={{
                  borderColor: activeCategory === value ? "#b8965a" : "#2e2c28",
                  color: activeCategory === value ? "#b8965a" : "#7a7670",
                  background:
                    activeCategory === value
                      ? "rgba(184,150,90,0.08)"
                      : "transparent",
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-row w-full justify-between gap-10">
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <PriceRangeFilter
          low={low}
          setLow={setLow}
          high={high}
          setHigh={setHigh}
        />
      </div>

      {/* ── Grid / List ── */}
      <main className="px-10 py-8">
        {!data && !error ? (
          <p className="h-[80vh]">Loading...</p>
        ) : error ? (
          <div className="flex flex-col">
            <h1>Error happened:</h1>
            <p className="text-red">{error.message}</p>;
          </div>
        ) : (
          <ProductList data={data} />
        )}

        <Paginate
          current={page}
          setCurrent={setPage}
          total={Math.ceil((data?.count ?? 0) / 12)}
        />
      </main>
    </div>
  );
}
