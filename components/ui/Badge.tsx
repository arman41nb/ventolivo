interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-brown/10 bg-white/65 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-olive shadow-[0_8px_18px_rgba(72,49,30,0.04)] ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-olive" />
      {children}
    </span>
  );
}
