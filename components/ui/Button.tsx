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
    "bg-brown text-white border-brown hover:bg-dark hover:border-dark",
  secondary:
    "bg-transparent text-brown border-brown hover:bg-brown hover:text-white",
  ghost:
    "bg-transparent text-muted border-transparent hover:text-brown",
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
    "inline-flex items-center gap-[10px] border px-[2rem] py-[0.8rem] font-sans text-[13px] tracking-[1px] cursor-pointer transition-colors no-underline",
    variantClasses[variant],
    className,
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          {...rest}
        >
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
