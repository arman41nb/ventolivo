import { STRIP_ITEMS } from "@/lib/constants";

export default function StripBanner() {
  return (
    <div className="bg-brown px-[2.5rem] py-[0.8rem] flex gap-[3rem] justify-center">
      {STRIP_ITEMS.map((item) => (
        <span
          key={item}
          className="text-[11px] tracking-[1.5px] uppercase text-white/[0.8]"
        >
          — {item}
        </span>
      ))}
    </div>
  );
}
