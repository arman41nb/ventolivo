import type { Dictionary } from "@/i18n";

interface FeaturesGridProps {
  dict?: Dictionary;
}

const featureIcons: Record<string, React.ReactNode> = {
  coldProcess: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  smallBatches: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  ),
  natural: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-brown fill-none" strokeWidth={1.5}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
};

export default function FeaturesGrid({ dict }: FeaturesGridProps) {
  const features = dict
    ? [
        {
          key: "coldProcess",
          icon: featureIcons.coldProcess,
          title: dict.features.items.coldProcess.title,
          text: dict.features.items.coldProcess.text,
        },
        {
          key: "smallBatches",
          icon: featureIcons.smallBatches,
          title: dict.features.items.smallBatches.title,
          text: dict.features.items.smallBatches.text,
        },
        {
          key: "natural",
          icon: featureIcons.natural,
          title: dict.features.items.natural.title,
          text: dict.features.items.natural.text,
        },
      ]
    : [
        {
          key: "coldProcess",
          icon: featureIcons.coldProcess,
          title: "Cold Process",
          text: "Traditional cold-process method preserving all natural glycerin and nutrients.",
        },
        {
          key: "smallBatches",
          icon: featureIcons.smallBatches,
          title: "Small Batches",
          text: "Each batch is made in small quantities to ensure maximum quality and freshness.",
        },
        {
          key: "natural",
          icon: featureIcons.natural,
          title: "100% Natural",
          text: "Only plant-based oils, butters, and botanicals. Nothing artificial, ever.",
        },
      ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 border-t border-brown/[0.15] mx-[2.5rem]">
      {features.map((feature, i, arr) => (
        <div
          key={feature.key}
          className={`p-[2.5rem] ${
            i < arr.length - 1 ? "border-r border-brown/[0.15]" : ""
          }`}
        >
          <div className="w-[32px] h-[32px] border border-brown flex items-center justify-center mb-[1rem]">
            {feature.icon}
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
