"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { SiteLocaleConfig } from "@/types";

interface LanguageSwitcherProps {
  locales: SiteLocaleConfig[];
}

export default function LanguageSwitcher({ locales }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = pathname.split("/")[1];
  const currentLocaleEntry = locales.find((locale) => locale.code === currentLocale);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!currentLocaleEntry || locales.length <= 1) return null;

  function switchLocale(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setIsOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-brown/8 bg-white/84 px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-[#8f735d] shadow-[0_10px_22px_rgba(72,49,30,0.05)] transition-colors hover:bg-white"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={currentLocaleEntry.label}
      >
        {currentLocaleEntry.code.toUpperCase()} {currentLocaleEntry.label}
        <svg
          viewBox="0 0 24 24"
          className={`w-3 h-3 stroke-current fill-none transition-transform ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute end-0 top-full z-50 mt-2 min-w-[170px] overflow-hidden rounded-[20px] border border-brown/8 bg-[rgba(255,253,249,0.97)] shadow-[0_18px_36px_rgba(107,79,58,0.1)] backdrop-blur"
          role="listbox"
          aria-label={currentLocaleEntry.label}
        >
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => switchLocale(locale.code)}
              className={`w-full cursor-pointer border-none px-4 py-3 text-start text-[12px] tracking-[0.08em] transition-colors ${
                locale.code === currentLocale
                  ? "bg-brown/8 text-brown"
                  : "bg-transparent text-muted hover:bg-brown/5 hover:text-brown"
              }`}
              role="option"
              aria-selected={locale.code === currentLocale}
            >
              {locale.code.toUpperCase()} {locale.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
