// src/components/ui/Tabs.tsx
import React, { useState, isValidElement } from "react";
import type { ReactNode } from "react";

interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

interface TabsListProps {
  children: ReactNode;
}

interface TabsTriggerProps {
  value: string;
  activeValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

interface TabsContentProps {
  value: string;
  activeValue?: string;
  children: ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (val: string) => {
    setInternalValue(val);
    onValueChange?.(val);
  };

  // Usamos React.Children.map y type assertions seguras
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeValue: internalValue,
            onValueChange: handleChange,
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children }: TabsListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-2 flex gap-2">
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  activeValue,
  onValueChange,
  children,
}: TabsTriggerProps) {
  const active = value === activeValue;
  return (
    <button
      onClick={() => onValueChange?.(value)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-green-500 text-white"
          : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  activeValue,
  children,
}: TabsContentProps) {
  if (value !== activeValue) return null;
  return <div className="mt-6">{children}</div>;
}
