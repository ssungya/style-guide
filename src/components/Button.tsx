import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--primary-contrast)] hover:bg-[var(--primary-dark)] disabled:opacity-40",
  secondary:
    "bg-[var(--surface)] text-[var(--text)] border-2 border-[var(--border)] hover:border-[var(--primary)] disabled:opacity-40",
  ghost:
    "bg-transparent text-[var(--primary)] hover:bg-[var(--surface-muted)] disabled:opacity-40",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`min-h-14 w-full rounded-2xl px-6 text-lg font-bold transition-colors disabled:cursor-not-allowed ${variantClass[variant]} ${className}`}
      {...props}
    />
  );
}
