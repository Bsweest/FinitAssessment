import { GetProductsDto } from "../../client/types.gen";
import { ProductCard } from "./ProductCard";

type Props = { data: GetProductsDto | undefined };

export function ProductList({ data }: Props) {
  if (!data) return <p>Error Happened</p>;

  return data.count === 0 ? (
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
      <p className="text-sm tracking-widest uppercase">No products found</p>
    </div>
  ) : (
    <div
      className="grid gap-px"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      }}
    >
      {data.items!.map((product, i) => (
        <ProductCard key={product.id} {...product} index={i} />
      ))}
    </div>
  );
}
