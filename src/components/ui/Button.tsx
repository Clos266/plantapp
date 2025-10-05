import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "auto" | "md" | "full";
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    // 👇 padding reducido en mobile, más grande en sm+
    "font-semibold rounded-lg transition-colors focus:outline-none text-center py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base";

  const variants = {
    primary:
      "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    danger:
      "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
  };

  // 👇 Responsivo + uniforme
  const sizes = {
    auto: "w-auto",
    md: "min-w-[110px] sm:min-w-[140px] md:min-w-[160px] w-full sm:w-auto",
    full: "w-full",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}
