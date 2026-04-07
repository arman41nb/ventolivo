"use client";

/* eslint-disable @next/next/no-img-element */

interface SceneImageProps {
  src?: string;
  alt?: string;
  label: string;
  hint: string;
  imageClassName: string;
  placeholderClassName?: string;
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current" strokeWidth={1.6}>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m7 16 3.8-3.8a1 1 0 0 1 1.4 0L14.5 14l1.7-1.7a1 1 0 0 1 1.4 0L20 14.7" />
    </svg>
  );
}

export default function SceneImage({
  src,
  alt,
  label,
  hint,
  imageClassName,
  placeholderClassName = "",
}: SceneImageProps) {
  if (src) {
    return <img src={src} alt={alt || label} className={imageClassName} />;
  }

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-brown/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,239,231,0.88))] px-4 py-5 text-center text-brown/66 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] ${placeholderClassName}`}
    >
      <ImageIcon />
      <p className="mt-3 text-[12px] uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-2 max-w-[180px] text-xs leading-5 text-muted">{hint}</p>
    </div>
  );
}
