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
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-[28px] bg-warm">
        {selectedItem ? (
          selectedItem.type === "video" ? (
            <video
              controls
              poster={selectedItem.thumbnailUrl}
              className="aspect-square w-full bg-dark object-cover"
            >
              <source src={selectedItem.url} />
              {selectedItem.alt ?? `${productName} video`}
            </video>
          ) : (
            <img
              src={selectedItem.url}
              alt={selectedItem.alt ?? productName}
              className="aspect-square w-full object-cover"
            />
          )
        ) : (
          <div className="flex aspect-square items-center justify-center">
            <div className="h-[140px] w-[140px] rounded-[12px]" style={{ backgroundColor: color }} />
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
              className={`overflow-hidden rounded-[18px] border transition-colors ${
                selectedIndex === index ? "border-brown" : "border-brown/10"
              }`}
            >
              <div className="relative">
                <img
                  src={item.type === "video" ? item.thumbnailUrl || item.url : item.url}
                  alt={item.alt ?? productName}
                  className="aspect-square w-full object-cover"
                />
                {item.type === "video" ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-dark/25 text-xs uppercase tracking-[0.16em] text-white">
                    Video
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
