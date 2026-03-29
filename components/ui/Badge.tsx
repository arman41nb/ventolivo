interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`text-[11px] tracking-[2px] uppercase text-olive ${className}`}
    >
      {children}
    </span>
  );
}
