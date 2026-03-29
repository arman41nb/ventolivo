import { FEATURES } from "@/lib/constants";

const featureIcons: Record<string, React.ReactNode> = {
  "Cold Process": (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  "Small Batches": (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  ),
  "100% Natural": (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
};

export default function FeaturesGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 border-t border-brown/[0.15] mx-[2.5rem]">
      {FEATURES.map((feature, i, arr) => (
        <div
          key={feature.title}
          className={`p-[2.5rem] ${
            i < arr.length - 1 ? "border-r border-brown/[0.15]" : ""
          }`}
        >
          <div className="w-[32px] h-[32px] border border-brown flex items-center justify-center mb-[1rem]">
            {featureIcons[feature.title]}
          </div>
          <p className="font-serif text-[18px] text-dark mb-[0.5rem]">
            {feature.title}
          </p>
          <p className="text-[13px] leading-[1.7] text-muted">{feature.text}</p>
        </div>
      ))}
    </section>
  );
}
