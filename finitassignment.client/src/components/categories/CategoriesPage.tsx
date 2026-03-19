import { useState, useMemo, useRef, useEffect, FC, ReactNode } from "react";
import { CategoryDto, CreateUpdateCategoryDto } from "../../client/types.gen";

type ModalMode = "create" | "edit" | null;

interface FormState {
  name: string;
  description: string;
  isActive: boolean;
  displayOrder: number | string;
  parentId: number | string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  isActive: true,
  displayOrder: "",
  parentId: "",
};

function categoryToForm(c: CategoryDto): FormState {
  return {
    name: c.name,
    description: c.description,
    isActive: c.isActive,
    displayOrder: c.displayOrder,
    parentId: c.parentId ?? "",
  };
}

const GOLD = "#C9A84C";
const GOLD_DIM = "#7A6228";
const BLACK = "#0A0A0A";
const SURFACE = "#111111";
const BORDER = "#2A2A2A";
const BORDER_GOLD = "#3A3018";
const TEXT = "#F0E8D0";
const TEXT_DIM = "#6A6040";
const TEXT_MUTED = "#3A3318";

// ─── Primitives ───────────────────────────────────────────────────────────────

const Label: FC<{ children: ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label
    style={{
      display: "block",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: TEXT_DIM,
      marginBottom: 8,
    }}
  >
    {children}
    {required && <span style={{ color: GOLD, marginLeft: 2 }}>*</span>}
  </label>
);

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
      {error && (
        <p style={{ fontSize: 11, color: "#C05050", marginTop: 6 }}>{error}</p>
      )}
    </div>
  );
}

function GoldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        width: "100%",
        background: BLACK,
        border: `1px solid ${focused ? GOLD : BORDER}`,
        color: TEXT,
        fontSize: 13,
        padding: "10px 14px",
        outline: "none",
        transition: "border-color 0.15s",
        boxSizing: "border-box",
        fontFamily: "inherit",
      }}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
    />
  );
}

function GoldTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      rows={3}
      className="bg-[#0f0e0c]"
      style={{
        width: "100%",

        border: `1px solid ${focused ? GOLD : BORDER}`,
        color: TEXT,
        fontSize: 13,
        padding: "10px 14px",
        outline: "none",
        resize: "none",
        transition: "border-color 0.15s",
        boxSizing: "border-box",
        fontFamily: "inherit",
      }}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
    />
  );
}

function GoldSelect({
  value,
  onChange,
  children,
}: {
  value: string | number;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      className="bg-[#0f0e0c]"
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",

        border: `1px solid ${focused ? GOLD : BORDER}`,
        color: value === "" ? TEXT_DIM : TEXT,
        fontSize: 13,
        padding: "10px 14px",
        outline: "none",
        appearance: "none",
        cursor: "pointer",
        transition: "border-color 0.15s",
        boxSizing: "border-box",
        fontFamily: "inherit",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

const Toggle: FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({
  checked,
  onChange,
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    style={{
      width: 44,
      height: 24,
      background: checked ? GOLD : BORDER,
      border: "none",
      cursor: "pointer",
      position: "relative",
      transition: "background 0.2s",
      flexShrink: 0,
    }}
  >
    <span
      style={{
        position: "absolute",
        top: 4,
        left: checked ? 22 : 4,
        width: 16,
        height: 16,
        background: checked ? BLACK : TEXT_DIM,
        transition: "left 0.2s",
      }}
    />
  </button>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge: FC<{ active: boolean }> = ({ active }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      border: `1px solid ${active ? GOLD_DIM : BORDER}`,
      color: active ? GOLD : TEXT_MUTED,
      background: active ? "rgba(201,168,76,0.06)" : "transparent",
    }}
  >
    <span
      style={{
        width: 5,
        height: 5,
        background: active ? GOLD : BORDER,
        flexShrink: 0,
      }}
    />
    {active ? "Active" : "Inactive"}
  </span>
);

// ─── Icon button ──────────────────────────────────────────────────────────────

const IconBtn: FC<{
  d: string;
  title: string;
  color?: string;
  onClick: () => void;
}> = ({ d, title, color = GOLD, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32,
        height: 32,
        border: `1px solid ${hov ? color : BORDER}`,
        background: hov ? `${color}14` : "transparent",
        color: hov ? color : TEXT_MUTED,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        style={{ width: 14, height: 14 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
      </svg>
    </button>
  );
};

// ─── Confirm dialog ───────────────────────────────────────────────────────────

const ConfirmDialog: FC<{
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ name, onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      background: "rgba(0,0,0,0.88)",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 380,
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        padding: 32,
        animation: "modalIn 0.2s ease forwards",
      }}
    >
      <div
        style={{
          width: 1,
          height: 48,
          background: "#C05050",
          margin: "0 auto 24px",
        }}
      />
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: TEXT,
          textAlign: "center",
          marginBottom: 8,
          letterSpacing: "0.02em",
        }}
      >
        Delete Category
      </h3>
      <p
        style={{
          fontSize: 13,
          color: TEXT_DIM,
          textAlign: "center",
          marginBottom: 28,
          lineHeight: 1.6,
        }}
      >
        "<span style={{ color: GOLD }}>{name}</span>" and its subcategories will
        be permanently removed.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "10px 0",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: "transparent",
            border: `1px solid ${BORDER}`,
            color: TEXT_DIM,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: "10px 0",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: "#C05050",
            border: "1px solid #C05050",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Category modal ───────────────────────────────────────────────────────────

type CategoryModalProps = {
  mode: "create" | "edit";
  initial: FormState;
  categories: CategoryDto[];
  editingId?: number;
  onClose: () => void;
  onSubmit: (data: FormState) => void;
};

const CategoryModal: FC<CategoryModalProps> = ({
  mode,
  initial,
  categories,
  editingId,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  function set<K extends keyof FormState>(k: K) {
    return (v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.displayOrder === "" || isNaN(Number(form.displayOrder)))
      e.displayOrder = "Required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    await new Promise<void>((r) => setTimeout(r, 600));
    onSubmit(form);
  }

  const eligibleParents = categories.filter((c) => c.id !== editingId);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.88)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          animation: "modalIn 0.25s ease forwards",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{ width: 3, height: 32, background: GOLD, flexShrink: 0 }}
            />
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: GOLD_DIM,
                  marginBottom: 2,
                }}
              >
                {mode === "create" ? "New Record" : "Edit Record"}
              </p>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: TEXT,
                  letterSpacing: "0.02em",
                }}
              >
                {mode === "create" ? "Create Category" : "Update Category"}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              background: "transparent",
              border: `1px solid ${BORDER}`,
              color: TEXT_DIM,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              style={{ width: 14, height: 14 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <Field label="Category Name" required error={errors.name}>
              <GoldInput
                placeholder="e.g. Audio Equipment"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
              />
            </Field>

            <Field label="Description">
              <GoldTextarea
                placeholder="Brief description…"
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
              />
            </Field>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Field label="Display Order" required error={errors.displayOrder}>
                <GoldInput
                  type="number"
                  min="1"
                  placeholder="1"
                  value={form.displayOrder}
                  onChange={(e) => set("displayOrder")(e.target.value)}
                />
              </Field>
              <Field label="Parent">
                <GoldSelect
                  value={form.parentId}
                  onChange={(v) => set("parentId")(v)}
                >
                  <option value="">None (root)</option>
                  {eligibleParents.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </GoldSelect>
              </Field>
            </div>

            {/* Active toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                border: `1px solid ${BORDER}`,
                background: BLACK,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: TEXT,
                    marginBottom: 2,
                  }}
                >
                  Active
                </p>
                <p style={{ fontSize: 11, color: TEXT_DIM }}>
                  Visible to customers
                </p>
              </div>
              <Toggle checked={form.isActive} onChange={set("isActive")} />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: `1px solid ${BORDER}`,
              display: "flex",
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px 0",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                background: "transparent",
                border: `1px solid ${BORDER}`,
                color: TEXT_DIM,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: "11px 0",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                background: saving ? GOLD_DIM : GOLD,
                border: `1px solid ${saving ? GOLD_DIM : GOLD}`,
                color: BLACK,
                cursor: saving ? "wait" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {saving
                ? "Saving…"
                : mode === "create"
                  ? "Create"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

type Props = {
  data: CategoryDto[];
  onCreate: (value: CreateUpdateCategoryDto) => void;
  onUpdate: (value: { id: number; data: CreateUpdateCategoryDto }) => void;
};

export default function ManageCategoriesPage({
  data,
  onCreate,
  onUpdate,
}: Props) {
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [modal, setModal] = useState<ModalMode>(null);
  const [editTarget, setEditTarget] = useState<CategoryDto | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = useMemo(
    () =>
      data
        .filter((it) => {
          switch (filterActive) {
            case "all":
              return true;
            case "active":
              return it.isActive;
            case "inactive":
              return !it.isActive;
          }
        })
        .filter(
          (it) =>
            !search || it.name.toUpperCase().includes(search.toUpperCase()),
        ),
    [data, filterActive, search],
  );

  const rows = useMemo(() => {
    const result: { category: CategoryDto; depth: number }[] = [];
    function walk(list: CategoryDto[], depth: number) {
      list.forEach((c) => {
        result.push({ category: c, depth });
        walk(
          filtered.filter((x) => x.parentId === c.id),
          depth + 1,
        );
      });
    }
    walk(
      filtered.filter((c) => c.parentId === null),
      0,
    );
    filtered.forEach((c) => {
      if (!result.find((r) => r.category.id === c.id))
        result.push({ category: c, depth: 0 });
    });
    return result;
  }, [filtered]);

  function handleCreate(form: FormState) {
    const cat: CreateUpdateCategoryDto = {
      name: form.name,
      description: form.description,
      isActive: form.isActive,
      displayOrder: Number(form.displayOrder),
      parentId: form.parentId !== "" ? Number(form.parentId) : null,
    };
    onCreate(cat);
    setModal(null);
    showToast(`"${cat.name}" created`);
  }

  function handleEdit(form: FormState) {
    if (!editTarget) return;

    onUpdate({
      id: editTarget.id,
      data: {
        name: form.name,
        description: form.description,
        isActive: form.isActive,
        displayOrder: Number(form.displayOrder),
        parentId: form.parentId !== "" ? Number(form.parentId) : null,
      },
    });

    setModal(null);
    setEditTarget(null);
    showToast(`"${form.name}" updated`);
  }

  const stats = useMemo(
    () => ({
      total: data.length,
      active: data.filter((c) => c.isActive).length,
      inactive: data.filter((c) => !c.isActive).length,
      roots: data.filter((c) => c.parentId === null).length,
    }),
    [data],
  );

  const thStyle = (hidden?: boolean): React.CSSProperties => ({
    padding: "12px 20px",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: TEXT_DIM,
    textAlign: "left",
    borderBottom: `1px solid ${BORDER}`,
    userSelect: "none",
    display: hidden ? undefined : undefined,
    whiteSpace: "nowrap",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #0A0A0A; }
        @keyframes modalIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        select option { background: #111; color: #F0E8D0; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2A2A2A; }
        ::selection { background: rgba(201,168,76,0.2); }
        tr:hover td { background: #161616 !important; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: BLACK,
          fontFamily: "'DM Sans', sans-serif",
          color: TEXT,
          animation: "fadeIn 0.3s ease forwards",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
          {/* ── Page title ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 36,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: TEXT,
                letterSpacing: "0.02em",
              }}
            >
              Categories
            </h1>
            <p style={{ fontSize: 13, color: TEXT_DIM }}>
              Manage and organise your product taxonomy
            </p>

            <button
              onClick={() => setModal("create")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                background: GOLD,
                border: `1px solid ${GOLD}`,
                color: BLACK,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              New Category
            </button>
          </div>

          {/* ── Stat cards ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              marginBottom: 32,
              border: `1px solid ${BORDER}`,
            }}
          >
            {[
              { label: "Total", value: stats.total },
              { label: "Active", value: stats.active },
              { label: "Inactive", value: stats.inactive },
              { label: "Root", value: stats.roots },
            ].map(({ label, value }, i) => (
              <div
                key={label}
                style={{
                  padding: "20px 24px",
                  background: SURFACE,
                  borderRight: i < 3 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: TEXT_DIM,
                    marginBottom: 10,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: GOLD,
                    fontFamily: "'DM Mono', monospace",
                    lineHeight: 1,
                  }}
                >
                  {String(value).padStart(2, "0")}
                </p>
              </div>
            ))}
          </div>

          {/* ── Toolbar ── */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke={TEXT_DIM}
                style={{
                  width: 14,
                  height: 14,
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                  fontSize: 13,
                  padding: "9px 14px 9px 36px",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = GOLD)}
                onBlur={(e) => (e.target.style.borderColor = BORDER)}
              />
            </div>

            {/* Filter pills */}
            <div style={{ display: "flex", border: `1px solid ${BORDER}` }}>
              {(["all", "active", "inactive"] as const).map((v, i) => (
                <button
                  key={v}
                  onClick={() => setFilterActive(v)}
                  style={{
                    padding: "0 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    background: filterActive === v ? GOLD : "transparent",
                    color: filterActive === v ? BLACK : TEXT_DIM,
                    border: "none",
                    borderRight: i < 2 ? `1px solid ${BORDER}` : "none",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* ── Table ── */}
          <div style={{ border: `1px solid ${BORDER}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: SURFACE }}>
                  <th
                    style={{ ...thStyle(), display: "none" as any }}
                    className="md-show"
                  >
                    Parent
                  </th>
                  <th style={{ ...thStyle(), width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "60px 24px",
                        textAlign: "center",
                        color: TEXT_MUTED,
                        fontSize: 13,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      No categories found
                    </td>
                  </tr>
                ) : (
                  rows.map(({ category, depth }, i) => {
                    const parentName = data.find(
                      (c) => c.id === category.parentId,
                    )?.name;
                    return (
                      <tr
                        key={category.id}
                        style={{ borderBottom: `1px solid ${BORDER}` }}
                      >
                        {/* Name */}
                        <td style={{ padding: "14px 20px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              paddingLeft: depth * 20,
                            }}
                          >
                            {depth > 0 && (
                              <span
                                style={{
                                  color: BORDER,
                                  fontSize: 14,
                                  lineHeight: 1,
                                  flexShrink: 0,
                                }}
                              >
                                └
                              </span>
                            )}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: TEXT,
                                  }}
                                >
                                  {category.name}
                                </span>
                                {category.parentId === null && (
                                  <span
                                    style={{
                                      fontSize: 9,
                                      fontWeight: 700,
                                      letterSpacing: "0.18em",
                                      textTransform: "uppercase",
                                      padding: "2px 6px",
                                      border: `1px solid ${GOLD_DIM}`,
                                      color: GOLD_DIM,
                                    }}
                                  >
                                    Root
                                  </span>
                                )}
                              </div>
                              {category.description && (
                                <p
                                  style={{
                                    fontSize: 11,
                                    color: TEXT_MUTED,
                                    marginTop: 3,
                                    maxWidth: 280,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* Parent */}
                        <td
                          style={{
                            padding: "14px 20px",
                            fontSize: 12,
                            color: TEXT_DIM,
                          }}
                        >
                          {parentName ?? (
                            <span style={{ color: BORDER }}>—</span>
                          )}
                        </td>
                        {/* Order */}
                        <td style={{ padding: "14px 20px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              width: 28,
                              height: 28,
                              border: `1px solid ${BORDER}`,
                              textAlign: "center",
                              lineHeight: "28px",
                              fontSize: 12,
                              fontWeight: 700,
                              color: GOLD,
                              fontFamily: "'DM Mono', monospace",
                            }}
                          >
                            {category.displayOrder}
                          </span>
                        </td>
                        {/* Status */}
                        <td style={{ padding: "14px 20px" }}>
                          <StatusBadge active={category.isActive} />
                        </td>
                        {/* Actions */}
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <IconBtn
                              title="Edit"
                              color={GOLD}
                              onClick={() => {
                                setEditTarget(category);
                                setModal("edit");
                              }}
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Table footer */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: `1px solid ${BORDER}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: SURFACE,
              }}
            >
              <p style={{ fontSize: 11, color: TEXT_MUTED }}>
                <span style={{ color: TEXT_DIM }}>{rows.length}</span> of{" "}
                <span style={{ color: TEXT_DIM }}>{data.length}</span>{" "}
                categories
              </p>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 0.4, 0.2].map((op, i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 2,
                      background: GOLD,
                      opacity: op,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "create" && (
        <CategoryModal
          mode="create"
          initial={EMPTY_FORM}
          categories={data}
          onClose={() => setModal(null)}
          onSubmit={handleCreate}
        />
      )}
      {modal === "edit" && editTarget && (
        <CategoryModal
          mode="edit"
          initial={categoryToForm(editTarget)}
          categories={data}
          editingId={editTarget.id}
          onClose={() => {
            setModal(null);
            setEditTarget(null);
          }}
          onSubmit={handleEdit}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 18px",
            background: SURFACE,
            border: `1px solid ${GOLD_DIM}`,
            fontSize: 12,
            color: TEXT,
            animation: "toastIn 0.25s ease forwards",
          }}
        >
          <span
            style={{ width: 6, height: 6, background: GOLD, flexShrink: 0 }}
          />
          {toast}
        </div>
      )}
    </>
  );
}
