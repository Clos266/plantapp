// src/components/layouts/AuthLayout.tsx
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        bg-gray-50 dark:bg-gray-900
      "
    >
      <div
        className="
          bg-white dark:bg-gray-800
          rounded-xl shadow-lg p-8 w-full max-w-md
        "
      >
        {children}
      </div>
    </div>
  );
}
