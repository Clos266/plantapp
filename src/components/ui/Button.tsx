import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "xs" | "sm" | "md" | "full";
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const base =
    "font-medium rounded-md transition-colors focus:outline-none text-center text-xs sm:text-sm py-1 px-2";

  const variants = {
    primary:
      "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    danger:
      "bg-red-100 text-red-700 hover:bg-red-500 hover:text-white dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-600 dark:hover:text-white",
  };

  const sizes = {
    xs: "w-auto min-w-[60px]",
    sm: "w-auto min-w-[75px]",
    md: "w-auto min-w-[100px]",
    full: "w-full",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
