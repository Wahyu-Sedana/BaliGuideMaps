"use client";

import type { Category } from "@/domain/entities";

interface Props {
  categories: Category[];
  selectedCategory: number | null;
  onSelect: (id: number | null) => void;
}

const CATEGORY_STYLE: Record<string, { bg: string; activeBg: string; border: string; color: string; svg: string }> = {
  wisata: {
    bg: "#dcfce7", activeBg: "#16a34a", border: "#16a34a", color: "#16a34a",
    svg: `<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.4 2 5 2 2.5-2 5-2 1.9.5 2.5 1"/>
          <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.4 2 5 2 2.5-2 5-2 1.9.5 2.5 1"/>`,
  },
  health: {
    bg: "#fee2e2", activeBg: "#dc2626", border: "#dc2626", color: "#dc2626",
    svg: `<path d="M12 2v20"/><path d="M2 12h20"/>`,
  },
  hotel: {
    bg: "#dbeafe", activeBg: "#2563eb", border: "#2563eb", color: "#2563eb",
    svg: `<path d="M3 22V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"/>
          <path d="M3 22h18"/>
          <path d="M9 22v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4"/>`,
  },
  restoran: {
    bg: "#ffedd5", activeBg: "#ea580c", border: "#ea580c", color: "#ea580c",
    svg: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
          <path d="M7 2v20"/>
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v4"/>`,
  },
  pura: {
    bg: "#ede9fe", activeBg: "#7c3aed", border: "#7c3aed", color: "#7c3aed",
    svg: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>`,
  },
};

const DEFAULT_STYLE = {
  bg: "#f3f4f6", activeBg: "#1f2937", border: "#6b7280", color: "#6b7280",
  svg: `<circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
        <circle cx="5" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>`,
};

export default function CategoryFilter({ categories, selectedCategory, onSelect }: Props) {
  const allActive = selectedCategory === null;
  const allStyle = allActive
    ? { bg: "#1f2937", border: "#1f2937", color: "#ffffff" }
    : { bg: "#ffffff", border: "#d1d5db", color: "#6b7280" };

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {/* Semua */}
      <button
        onClick={() => onSelect(null)}
        title="Semua"
        style={{
          width: 52, height: 52,
          borderRadius: "50%",
          backgroundColor: allStyle.bg,
          border: `2.5px solid ${allStyle.border}`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          boxShadow: allActive
            ? "0 0 0 3px rgba(31,41,55,0.25), 0 4px 12px rgba(0,0,0,0.2)"
            : "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.2s",
          gap: 2,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke={allStyle.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
        </svg>
        <span style={{ fontSize: 9, color: allStyle.color, fontWeight: 600, lineHeight: 1 }}>Semua</span>
      </button>

      {categories.map((cat) => {
        const key = cat.name.toLowerCase();
        const cfg = CATEGORY_STYLE[key] ?? DEFAULT_STYLE;
        const active = selectedCategory === cat.id;
        const iconColor = active ? "#ffffff" : cfg.color;
        const bgColor = active ? cfg.activeBg : cfg.bg;
        const borderColor = cfg.border;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(active ? null : cat.id)}
            title={cat.name}
            style={{
              width: 52, height: 52,
              borderRadius: "50%",
              backgroundColor: bgColor,
              border: `2.5px solid ${borderColor}`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              boxShadow: active
                ? `0 0 0 3px ${cfg.border}40, 0 4px 12px rgba(0,0,0,0.2)`
                : "0 4px 12px rgba(0,0,0,0.15)",
              transition: "all 0.2s",
              gap: 2,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: cfg.svg }}
            />
            <span style={{ fontSize: 9, color: iconColor, fontWeight: 600, lineHeight: 1 }}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
