import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  external?: never;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

type ButtonProps = ButtonAsLink | ButtonAsButton;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[linear-gradient(135deg,#7a5638_0%,#5d3d27_100%)] text-white hover:-translate-y-0.5",
  secondary: "border-brown/15 bg-white/60 text-brown hover:bg-white",
  ghost: "border-transparent bg-transparent text-muted hover:text-brown",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  href,
  external,
  onClick,
  type = "button",
  ...rest
}: ButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center gap-[10px] rounded-full border px-6 py-4 font-sans text-[13px] font-medium uppercase tracking-[0.16em] cursor-pointer transition-all no-underline shadow-[0_10px_22px_rgba(72,49,30,0.06)]",
    variantClasses[variant],
    className,
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClasses} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses} {...rest}>
      {children}
    </button>
  );
}
