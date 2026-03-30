"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales, localeLabels, localeFlags } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = pathname.split("/")[1] as Locale;
  const isValid = locales.includes(currentLocale);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isValid) return null;

  function switchLocale(newLocale: Locale) {
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
      >
        {localeFlags[currentLocale]} {currentLocale.toUpperCase()}
        <svg
          viewBox="0 0 24 24"
          className={`w-3 h-3 stroke-current fill-none transition-transform ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-[0.5rem] bg-cream border border-brown/[0.15] shadow-lg min-w-[140px] z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale)}
              className={`w-full text-left px-[1rem] py-[0.6rem] text-[12px] tracking-[1px] cursor-pointer border-none transition-colors ${
                locale === currentLocale
                  ? "bg-brown/[0.1] text-brown"
                  : "bg-transparent text-muted hover:bg-brown/[0.05] hover:text-brown"
              }`}
            >
              {localeFlags[locale]} {localeLabels[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
