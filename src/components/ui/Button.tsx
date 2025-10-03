// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "font-semibold py-3 rounded-lg transition-colors focus:outline-none";

  const variants = {
    primary:
      "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
