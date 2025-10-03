// src/components/ui/Input.tsx
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="
        border border-gray-300 rounded-lg p-3 w-full
        focus:outline-none focus:ring-2 focus:ring-green-400
        bg-white text-gray-900
        dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-green-500
      "
    />
  );
}
