import {
  useState,
  useRef,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

const MIN = 0;
const MAX = 1000;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;
const fromPct = (p: number) =>
  Math.round(((p / 100) * (MAX - MIN) + MIN) / 5) * 5;

type Props = {
  low: number;
  setLow: Dispatch<SetStateAction<number>>;
  high: number;
  setHigh: Dispatch<SetStateAction<number>>;
};

export default function PriceRangeFilter({
  low,
  setLow,
  high,
  setHigh,
}: Props) {
  const dragging = useRef<"low" | "high">(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const getVal = useCallback((clientX: number) => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      return fromPct(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
    }
    return 0;
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current) return;
      const v = getVal(e.clientX);
      if (dragging.current === "low") setLow(clamp(v, MIN, high - 5));
      else setHigh(clamp(v, low + 5, MAX));
    },
    [low, high, getVal],
  );

  const onMouseUp = useCallback(() => {
    dragging.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div className="p-4 w-56 border border-amber-100 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-[#f0ece4]">Price</span>
      </div>

      <div
        ref={trackRef}
        className="relative h-1 bg-gray-200 rounded-full mx-1 my-4"
      >
        <div
          className="absolute h-full bg-amber-400 rounded-full"
          style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
        />
        <div
          className="absolute w-4 h-4 border-2 border-amber-400 rounded-full bg-amber-50 -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-grab shadow hover:border-amber-500 active:cursor-grabbing z-10"
          style={{ left: `${pct(low)}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            dragging.current = "low";
          }}
        />
        <div
          className="absolute w-4 h-4 border-2 border-amber-400 rounded-full bg-amber-50 -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-grab shadow hover:border-amber-500 active:cursor-grabbing z-10"
          style={{ left: `${pct(high)}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            dragging.current = "high";
          }}
        />
      </div>

      <div className="flex gap-2 mt-3">
        <div className="flex-1 relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[#f0ece4]">
            $
          </span>
          <input
            type="number"
            value={low}
            min={MIN}
            max={high - 5}
            onChange={(e) =>
              setLow(clamp(Number(e.target.value), MIN, high - 5))
            }
            className="w-full pl-5 pr-1 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-amber-400 text-[#f0ece4]"
          />
        </div>
        <div className="flex-1 relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[#f0ece4]">
            $
          </span>
          <input
            type="number"
            value={high}
            min={low + 5}
            max={MAX}
            onChange={(e) =>
              setHigh(clamp(Number(e.target.value), low + 5, MAX))
            }
            className="w-full pl-5 pr-1 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-amber-400 text-[#f0ece4]"
          />
        </div>
      </div>
    </div>
  );
}
