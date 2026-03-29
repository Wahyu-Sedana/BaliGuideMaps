"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Location } from "@/domain/entities";

interface Props {
  value: string;
  onChange: (value: string) => void;
  results: Location[];
  onSelect: (location: Location) => void;
}

export default function SearchBar({ value, onChange, results, onSelect }: Props) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showDropdown = focused && results.length > 0;

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 bg-white rounded-xl shadow px-3 py-2 border border-gray-200">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Cari lokasi di Bali..."
          className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-64 overflow-y-auto">
          {results.map((loc) => (
            <button
              key={loc.id}
              onMouseDown={() => onSelect(loc)}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <p className="text-sm font-medium text-gray-800">{loc.name}</p>
              <p className="text-xs text-gray-500 truncate">{loc.address}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
