import { useState } from "react";
import { ProductDto } from "../../client/types.gen";
import { formatPrice } from "../../utils";
import { Link } from "@tanstack/react-router";

type Props = ProductDto & { index: number };

export function ProductCard({
  id,
  category,
  description,
  imagePath,
  name,
  price,
  updatedAt,
  createdAt,
  customAttributes,
  index,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/products/$id`}
      params={{ id: id }}
      className="group relative flex flex-col bg-[#1a1916] border border-[#2e2c28] overflow-hidden cursor-pointer"
      style={{
        animation: `fadeUp 0.5s ${index * 0.07}s both ease-out`,
        transition: "border-color 0.25s, transform 0.25s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        borderColor: hovered ? "#b8965a" : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-[#221f1a]"
        style={{ aspectRatio: "4/3" }}
      >
        {imagePath && !imgError ? (
          <img
            src={imagePath}
            alt={name ?? "Product"}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#4a4740]">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="1" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-xs tracking-widest uppercase opacity-50">
              No Image
            </span>
          </div>
        )}

        {/* Category pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0f0e0c]/80 backdrop-blur-sm text-[10px] tracking-widest uppercase text-[#b8965a] border border-[#b8965a]/30">
          {category?.name ?? "Uncategorized"}
        </span>

        {/* Hover overlay CTA */}
        <div
          className="absolute inset-x-0 bottom-0 py-3 text-center text-xs tracking-[0.18em] uppercase font-medium text-[#f5f0e8] bg-[#b8965a] transition-transform duration-300"
          style={{
            transform: hovered ? "translateY(0)" : "translateY(100%)",
          }}
        >
          View Details
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-serif text-[17px] leading-snug tracking-tight text-[#f0ece4] truncate"
              title={name ?? ""}
            >
              {name ?? <span className="italic text-[#5a5750]">Unnamed</span>}
            </h3>
            <p className="text-[10px] text-[#4a4740] tracking-widest mt-0.5 uppercase">
              #{String(id).padStart(4, "0")}
            </p>
          </div>
          <span className="text-[18px] font-light tracking-tight text-[#b8965a] shrink-0">
            {formatPrice(price)}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[13px] text-[#7a7670] leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
