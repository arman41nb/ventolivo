import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-[0.4rem]">
      {label && (
        <label htmlFor={inputId} className="text-[12px] tracking-[1px] uppercase text-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "border border-brown/[0.2] bg-cream px-[1rem] py-[0.7rem] text-[14px] text-dark placeholder:text-muted/50 focus:border-brown focus:outline-none transition-colors",
          error && "border-red-500 focus:border-red-500",
          className,
        )}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-[12px] text-red-500" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-[12px] text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}
