import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  current: number;
  setCurrent: Dispatch<SetStateAction<number>>;
  total: number;
};

export function getPages(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3)
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export default function Paginate({ current, setCurrent, total }: Props) {
  const pages = getPages(current, total);
  const go = (p: number) => {
    setCurrent(p);
  };

  return (
    <div className="flex flex-col w-full items-center mt-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        .pg { font-family: 'Cormorant Garamond', Georgia, serif; }
        .pg-num { transition: color 0.15s; }
        .pg-num::after {
          content: '';
          display: block;
          height: 1px;
          background: #b45309;
          width: 0;
          margin: 0 auto;
          transition: width 0.2s ease;
        }
        .pg-num:hover::after { width: 12px; }
        .pg-num.active::after { width: 16px; }
      `}</style>

      {/* Label */}
      <p className="pg tracking-[0.2em] uppercase text-amber-500">
        Page {current} of {total}
      </p>

      {/* Pagination row */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => go(current - 1)}
          disabled={current === 1}
          className="pg flex items-center gap-1.5 px-3 py-1.5 text-sm italic text-stone-400 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2.5L5 7l4 4.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Prev
        </button>

        {/* Thin divider */}
        <div className="w-px h-5 bg-amber-200 mx-1" />

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="pg w-9 text-center text-stone-300 text-base select-none"
            >
              ·
            </span>
          ) : (
            <button
              key={p}
              onClick={() => {
                if (typeof p === "number") go(p);
              }}
              className={`pg pg-num w-9 h-9 text-base transition-colors duration-150 outline-none
                ${
                  current === p
                    ? "active text-amber-700 font-medium italic"
                    : "text-stone-400 hover:text-amber-700"
                }`}
            >
              {p}
            </button>
          ),
        )}

        {/* Thin divider */}
        <div className="w-px h-5 bg-amber-200 mx-1" />

        {/* Next */}
        <button
          onClick={() => go(current + 1)}
          disabled={current === total}
          className="pg flex items-center gap-1.5 px-3 py-1.5 text-sm italic text-stone-400 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Next
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M5 2.5L9 7l-4 4.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Decorative line */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-px bg-linear-to-r from-transparent to-amber-300" />
        <div className="w-1 h-1 rounded-full bg-amber-400" />
        <div className="w-12 h-px bg-linear-to-l from-transparent to-amber-300" />
      </div>
    </div>
  );
}
