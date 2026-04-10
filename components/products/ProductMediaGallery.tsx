/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import type { ProductMediaItem } from "@/types";

interface ProductMediaGalleryProps {
  items: ProductMediaItem[];
  productName: string;
  color: string;
}

export default function ProductMediaGallery({
  items,
  productName,
  color,
}: ProductMediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItem = items[selectedIndex];

  return (
    <div className="animate-rise flex flex-col gap-4">
      <div className="mesh-bg overflow-hidden rounded-[30px] border border-brown/8 p-3 shadow-[0_16px_36px_rgba(72,49,30,0.08)]">
        {selectedItem ? (
          selectedItem.type === "video" ? (
            <video
              controls
              poster={selectedItem.thumbnailUrl}
              className="aspect-square w-full rounded-[24px] bg-dark object-cover"
            >
              <source src={selectedItem.url} />
              {selectedItem.alt ?? `${productName} video`}
            </video>
          ) : (
            <img
              src={selectedItem.url}
              alt={selectedItem.alt ?? productName}
              className="aspect-square w-full rounded-[24px] object-cover"
            />
          )
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-[24px] bg-white/55">
            <div
              className="animate-float h-[140px] w-[140px] rounded-[16px]"
              style={{ backgroundColor: color }}
            />
          </div>
        )}
      </div>

      {items.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {items.map((item, index) => (
            <button
              key={`${item.type}-${item.url}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`overflow-hidden rounded-[20px] border bg-white/70 p-1 transition-all ${
                selectedIndex === index
                  ? "border-brown shadow-[0_10px_20px_rgba(72,49,30,0.08)]"
                  : "border-brown/10 hover:-translate-y-0.5 hover:border-brown/30"
              }`}
            >
              <div className="relative">
                <img
                  src={item.type === "video" ? item.thumbnailUrl || item.url : item.url}
                  alt={item.alt ?? productName}
                  className="aspect-square w-full rounded-[16px] object-cover"
                />
                {item.type === "video" ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-dark/25 text-white">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-white/15 backdrop-blur-sm">
                      <span className="ms-0.5 text-sm leading-none">▶</span>
                    </span>
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
