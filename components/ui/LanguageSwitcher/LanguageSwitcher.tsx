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
        className="text-[12px] tracking-[1.5px] uppercase text-muted hover:text-brown transition-colors cursor-pointer bg-transparent border-none flex items-center gap-[4px]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Language: ${currentLocaleEntry.label}`}
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
          className="absolute top-full right-0 mt-[0.5rem] bg-cream border border-brown/[0.15] shadow-lg min-w-[140px] z-50"
          role="listbox"
          aria-label="Select language"
        >
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => switchLocale(locale.code)}
              className={`w-full text-left px-[1rem] py-[0.6rem] text-[12px] tracking-[1px] cursor-pointer border-none transition-colors ${
                locale.code === currentLocale
                  ? "bg-brown/[0.1] text-brown"
                  : "bg-transparent text-muted hover:bg-brown/[0.05] hover:text-brown"
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
