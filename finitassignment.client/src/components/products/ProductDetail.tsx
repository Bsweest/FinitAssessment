import { useState } from "react";
import { CategoryDto, ProductDto } from "../../client/types.gen";
import {
  CreateUpdateProductDto,
  CreateUpdateProductDialog,
} from "./CreateUpdateProductDialog";
import { deleteProduct } from "../../client/sdk.gen";
import { useNavigate } from "@tanstack/react-router";

type Props = ProductDto & { mutate: (data: CreateUpdateProductDto) => void };

export default function ProductDetailPage({
  id,
  name,
  description,
  price,
  imagePath,
  category,
  customAttributes,
  mutate,
}: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function onDelete() {
    const confirmed = confirm("Do you want to delete this product");
    if (confirmed) {
      const { error } = await deleteProduct({
        path: { id },
      });

      if (!error) {
        alert(`Product ${name} has been delete`);
        navigate({ to: "/" });
      }
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .pdp-root { font-family: 'DM Sans', sans-serif; }
        .pdp-root * { box-sizing: border-box; }
        .fade-up { opacity: 0; transform: translateY(16px); animation: pdpFadeUp 0.5s ease forwards; }
        @keyframes pdpFadeUp { to { opacity: 1; transform: translateY(0); } }
        .divider { height: 1px; background: linear-gradient(to right, transparent, #44403c 40%, transparent); }
        .btn-cart { transition: background 0.2s ease, transform 0.1s ease; }
        .btn-cart:hover { transform: translateY(-1px); }
        .btn-cart:active { transform: translateY(0); }
      `}</style>

      <div className="pdp-root min-h-screen bg-stone-900 text-stone-100">
        {/* ── Header ── */}

        {/* ── Breadcrumb ── */}
        <div className="px-6 md:px-10 py-4 text-xs text-stone-500 tracking-wide flex gap-2 items-center">
          <a href="#" className="hover:text-stone-300 transition-colors">
            Home
          </a>
          <span className="text-stone-700">/</span>
          {name && (
            <>
              <a href="#" className="hover:text-stone-300 transition-colors">
                {category.name}
              </a>
              <span className="text-stone-700">/</span>
            </>
          )}
          <span className="text-stone-400 truncate max-w-40">
            {name ?? "Product"}
          </span>
        </div>

        {/* ── Main ── */}
        <main className="max-w-6xl mx-auto px-6 md:px-10 pb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start">
            {/* Left – image */}
            <div className="fade-up" style={{ animationDelay: "0.05s" }}>
              <ProductImage imagePath={imagePath} name={name} />
              <div className="flex gap-3 mt-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 rounded-xl bg-stone-800 cursor-pointer border-2 transition-colors ${i === 0 ? "border-amber-500" : "border-transparent hover:border-stone-600"}`}
                  />
                ))}
              </div>
            </div>

            {/* Right – details */}
            <div className="flex flex-col gap-5 pt-1">
              <div className="fade-up" style={{ animationDelay: "0.1s" }}>
                <CategoryBadge {...category} />
              </div>

              <div className="fade-up" style={{ animationDelay: "0.15s" }}>
                <h1
                  className="text-4xl lg:text-[2.75rem] font-bold leading-tight text-stone-100"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {name ?? "Unnamed Product"}
                </h1>
              </div>

              <div className="fade-up" style={{ animationDelay: "0.2s" }}>
                <Price price={price} />
              </div>

              <div
                className="divider fade-up"
                style={{ animationDelay: "0.22s" }}
              />

              {description && (
                <div className="fade-up" style={{ animationDelay: "0.25s" }}>
                  <p className="text-stone-400 leading-relaxed text-[0.95rem]">
                    {description}
                  </p>
                </div>
              )}

              <div className="fade-up" style={{ animationDelay: "0.3s" }}>
                <CustomAttributes customAttributes={customAttributes} />
              </div>

              <div
                className="divider fade-up"
                style={{ animationDelay: "0.32s" }}
              />

              {/* Qty + CTA */}
              <div
                className="fade-up flex flex-col gap-4"
                style={{ animationDelay: "0.35s" }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    In stock
                  </div>
                </div>

                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="w-full py-4 bg-amber-200 text-black rounded-xl font-medium text-sm tracking-wide border border-stone-700 hover:border-stone-500 hover:text-stone-100 transition-colors"
                >
                  Update
                </button>

                <button
                  onClick={onDelete}
                  className="w-full bg-red-500 py-4 rounded-xl font-medium text-sm tracking-wide border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100 transition-colors"
                >
                  Delete
                </button>

                <button className="w-full py-4 rounded-xl font-medium text-sm tracking-wide border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100 transition-colors">
                  Buy now
                </button>
              </div>

              {/* Trust badges */}
              <div
                className="fade-up grid grid-cols-3 gap-3"
                style={{ animationDelay: "0.4s" }}
              >
                {[
                  {
                    icon: "🚚",
                    label: "Free shipping",
                    sub: "Orders over $200",
                  },
                  { icon: "↩", label: "30-day returns", sub: "Hassle-free" },
                  { icon: "🛡", label: "2-yr warranty", sub: "Full coverage" },
                ].map(({ icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-center p-3 rounded-xl bg-stone-800/50 border border-stone-800"
                  >
                    <span className="text-xl mb-1">{icon}</span>
                    <span className="text-xs text-stone-300 font-medium leading-snug">
                      {label}
                    </span>
                    <span className="text-xs text-stone-500 leading-snug mt-0.5">
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <CreateUpdateProductDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={(data) => mutate(data)}
        product={{
          categoryId: category.id,
          customAttributes: customAttributes,
          description,
          imagePath: imagePath ?? undefined,
          name,
          price,
          Image: undefined,
        }}
      />
    </>
  );
}

function ImagePlaceholder() {
  return (
    <div className="relative w-full aspect-square bg-stone-800 rounded-2xl overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
        }}
      />
      <div className="flex flex-col items-center gap-3 text-stone-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-16 h-16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18V3.75H3v16.5z"
          />
        </svg>
        <span className="text-sm tracking-widest uppercase font-light">
          No image
        </span>
      </div>
    </div>
  );
}

function ProductImage({
  imagePath,
  name,
}: {
  imagePath: string | null;
  name: string;
}) {
  const [errored, setErrored] = useState(false);
  if (!imagePath || errored) return <ImagePlaceholder />;

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-800">
      <img
        src={imagePath}
        alt={name ?? "Product"}
        className="w-full h-full object-cover"
        onError={(e) => setErrored(true)}
      />
    </div>
  );
}

function CategoryBadge({ name }: CategoryDto) {
  if (!name) return null;

  return (
    <span className="inline-block text-xs tracking-[0.2em] uppercase font-medium px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
      {name}
    </span>
  );
}

function Price({ price }: { price: number }) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="text-5xl font-bold text-stone-100"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {formatted}
      </span>
      <span className="text-stone-500 text-sm tracking-wider uppercase">
        USD
      </span>
    </div>
  );
}

function CustomAttributes({ customAttributes }: { customAttributes: string }) {
  if (!customAttributes) return null;
  let attrs = {};
  try {
    attrs = JSON.parse(customAttributes);
  } catch {
    return null;
  }
  const entries = Object.entries(attrs);
  if (!entries.length) return null;
  return (
    <div className="mt-6">
      <p className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-4">
        Specifications
      </p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
        {entries.map(([key, val]) => (
          <div key={key}>
            <dt className="text-xs text-stone-500 tracking-wide uppercase mb-0.5">
              {key}
            </dt>
            <dd className="text-sm text-stone-200 font-medium">
              {String(val)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
