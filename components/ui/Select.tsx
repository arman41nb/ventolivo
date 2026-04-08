import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export default function Select({
  label,
  error,
  options,
  placeholder,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-[0.4rem]">
      {label && (
        <label htmlFor={selectId} className="text-[12px] tracking-[1px] uppercase text-muted">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "border border-brown/[0.2] bg-cream px-[1rem] py-[0.7rem] text-[14px] text-dark focus:border-brown focus:outline-none transition-colors appearance-none cursor-pointer",
          error && "border-red-500 focus:border-red-500",
          className,
        )}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="text-[12px] text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
