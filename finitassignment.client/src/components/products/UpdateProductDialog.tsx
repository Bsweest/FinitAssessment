import {
  ChangeEvent,
  ComponentProps,
  ReactNode,
  SubmitEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

import { useQuery } from "@tanstack/react-query";
import { queryCategories } from "../../client/sdk.gen";
import { throwErrorMessage } from "../../utils";

export type CreateUpdateProductDto = {
  name: string;
  description: string;
  price: number;
  imagePath?: string;
  Image?: File;
  categoryId?: number;
  customAttributes: string;
};

type Props = {
  product: CreateUpdateProductDto;
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateUpdateProductDto) => void;
};

type Errors = { [id in keyof CreateUpdateProductDto]?: string };

export function UpdateProductDialog({ product, open, onClose, onSave }: Props) {
  const { data: categories } = useQuery({
    queryKey: [queryCategories.name],
    queryFn: async ({ signal }) => {
      const { data, error } = await queryCategories({ signal });
      if (error) throwErrorMessage(error);
      return data;
    },
    placeholderData: [],
  });

  const [form, setForm] = useState({
    name: product.name ?? "",
    description: product.description ?? "",
    price: product.price ?? 0,
    imagePath: product.imagePath ?? null,
    categoryId: product.categoryId ?? null,
    customAttributes: product.customAttributes ?? null,
    Image: undefined as File | undefined,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setForm({
        name: product.name ?? "",
        description: product.description ?? "",
        price: product.price ?? 0,
        imagePath: product.imagePath ?? null,
        categoryId: product.categoryId ?? null,
        customAttributes: product.customAttributes ?? null,
        Image: undefined,
      });
      setErrors({});
      setSaved(false);
    }
  }, [open]);

  function set(field: string) {
    return (val: string) => setForm((f) => ({ ...f, [field]: val }));
  }

  function validate() {
    const e: Errors = {};
    if (!form.name?.trim()) e.name = "Name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = "Enter a valid price";
    if (!form.categoryId) e.categoryId = "Select a category";
    return e;
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setSaving(true);
    setTimeout(onClose, 500);
    setSaving(false);
    setSaved(true);
    onSave?.({
      name: form.name || "",
      description: form.description || "",
      price: Number(form.price),
      imagePath: product.imagePath,
      categoryId: form.categoryId ?? undefined,
      customAttributes: form.customAttributes,
      Image: form.Image,
    });
    setTimeout(onClose, 500);
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-stone-900 rounded-2xl shadow-2xl border border-stone-800"
        style={{
          animation: "dialogIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-stone-900 z-10 flex items-center justify-between px-6 py-5 border-b border-stone-800">
          <div>
            <h2
              className="text-lg font-bold text-stone-100"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Manage Product
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Edit the fields below and save changes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-6 flex flex-col gap-5">
            {/* Image */}
            <ImageField
              value={form.imagePath}
              onChange={(val) => {
                if (!val) {
                  setForm((prev) => ({
                    ...prev,
                    imagePath: null,
                    Image: undefined,
                  }));
                } else setForm((prev) => ({ ...prev, Image: val }));
              }}
            />

            {/* Name */}
            <div>
              <Label required>Product Name</Label>
              <Input
                placeholder="e.g. Aether Pro Headphones"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
              />
              <ErrorMsg msg={errors.name} />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe this product…"
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
              />
            </div>

            {/* Price + Category row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>Price (USD)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => set("price")(e.target.value)}
                    className="pl-7"
                  />
                </div>
                <ErrorMsg msg={errors.price} />
              </div>

              <div>
                <Label required>Category</Label>
                <select
                  value={form.categoryId ?? 0}
                  onChange={(e) => set("categoryId")(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100
                    focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {categories!.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ErrorMsg msg={errors.categoryId} />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-stone-700 to-transparent" />

            {/* Custom attributes */}
            <AttributesEditor
              value={form.customAttributes}
              onChange={set("customAttributes")}
            />
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-stone-900 border-t border-stone-800 px-6 py-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-stone-400 border border-stone-700 hover:border-stone-500 hover:text-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || saved}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-80"
              style={{
                background: saved ? "#22c55e" : "#f59e0b",
                color: "#1a1917",
              }}
            >
              {saved ? "✓ Saved!" : saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type ImageFieldProps = {
  value: string | null;
  onChange: (val: File | undefined) => void;
};

function ImageField({ value, onChange }: ImageFieldProps) {
  const [preview, setPreview] = useState(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
  }

  function handleClear() {
    setPreview(null);
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <Label>Image</Label>
      <div
        className={`relative flex items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden
          ${preview ? "border-stone-600 h-40" : "border-stone-700 hover:border-amber-500/60 h-32"}`}
        onClick={() => !preview && inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-700 text-xs text-stone-200 hover:bg-stone-600 transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-900/60 text-xs text-red-300 hover:bg-red-800/60 transition-colors"
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-stone-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <span className="text-xs tracking-wide">Click to upload image</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

type AttributesEditorProps = {
  value: string | null;
  onChange: (val: string) => void;
};
function AttributesEditor({ value, onChange }: AttributesEditorProps) {
  const [attrs, setAttrs] = useState(() => {
    const parsed = parseAttrs(value);
    return parsed.length ? parsed : [{ key: "", value: "" }];
  });

  function update(index: number, field: keyof AttrRow, val: string): void {
    const next = attrs.map((a, i) =>
      i === index ? { ...a, [field]: val } : a,
    );
    setAttrs(next);
    onChange(stringifyAttrs(next) ?? "");
  }

  function addRow(): void {
    setAttrs((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeRow(index: number) {
    const next = attrs.filter((_, i) => i !== index);
    const final = next.length ? next : [{ key: "", value: "" }];
    setAttrs(final);
    onChange(stringifyAttrs(final) ?? "");
  }

  return (
    <div>
      <Label>Custom Attributes</Label>
      <div className="flex flex-col gap-2">
        {attrs.map((attr, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              placeholder="Key"
              value={attr.key}
              onChange={(e) => update(i, "key", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={attr.value}
              onChange={(e) => update(i, "value", e.target.value)}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 transition-colors w-fit mt-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add attribute
        </button>
      </div>
    </div>
  );
}

type AttrRow = {
  key: string;
  value: string;
};

function parseAttrs(raw: string | null): AttrRow[] {
  if (!raw) return [];
  try {
    return Object.entries(JSON.parse(raw)).map(([key, value]) => ({
      key,
      value: value as string,
    }));
  } catch {
    return [];
  }
}

function stringifyAttrs(attrs: AttrRow[]): string | null {
  const obj: Record<string, string> = {};

  attrs.forEach(({ key, value }) => {
    if (key.trim()) obj[key.trim()] = value;
  });
  return Object.keys(obj).length ? JSON.stringify(obj) : null;
}

function Label({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium tracking-widest uppercase text-stone-400 mb-1.5">
      {children}
      {required && <span className="text-amber-500 ml-0.5">*</span>}
    </label>
  );
}

function Input({ className = "", ...props }: ComponentProps<"input">) {
  return (
    <input
      className={`w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600
        focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={3}
      className={`w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600
        focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 transition-all resize-none ${className}`}
      {...props}
    />
  );
}

function ErrorMsg({ msg }: { msg: string | undefined }) {
  if (!msg) return null;
  return <p className="text-xs text-red-400 mt-1.5">{msg}</p>;
}
