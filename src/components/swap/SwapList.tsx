import { useState, useRef, useEffect } from "react";
import type { Swap } from "../../hooks/useSwaps";
import { Button } from "../ui/Button";
import SwapDetailCard from "./SwapDetailCard";

interface Props {
  swaps: Swap[];
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onComplete?: (id: number) => void;
  userId?: string;
}

export default function SwapList({
  swaps,
  onAccept,
  onReject,
  onComplete,
  userId,
}: Props) {
  const [selectedSwap, setSelectedSwap] = useState<Swap | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Close detail when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (detailRef.current && !detailRef.current.contains(e.target as Node)) {
        setSelectedSwap(null);
      }
    }

    if (selectedSwap) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedSwap]);

  if (!swaps.length)
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">
        You don’t have any swaps yet.
      </p>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
        Your Swaps
      </h2>

      <div className="space-y-3">
        {swaps.map((swap) => {
          const isSender = swap.sender_id === userId;

          return (
            <div
              key={swap.id}
              className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {/* Header — only this part toggles the detail */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setSelectedSwap(selectedSwap?.id === swap.id ? null : swap)
                }
              >
                <div>
                  <p className="font-medium">
                    {/* {isSender ? "📤 Sent" : "📥 Received"} */}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {swap.sender_plant?.nombre_comun} ↔{" "}
                    {swap.receiver_plant?.nombre_comun}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full capitalize ${
                    swap.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : swap.status === "accepted"
                      ? "bg-green-200 text-green-800"
                      : swap.status === "rejected"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {swap.status}
                </span>
              </div>

              {/* Expanded detail */}
              {selectedSwap?.id === swap.id && (
                <div
                  ref={detailRef}
                  className="mt-4 border-t border-gray-300 dark:border-gray-600 pt-4"
                  onClick={(e) => e.stopPropagation()} // ❗ prevents closing when clicking inside
                >
                  <SwapDetailCard
                    swap={swap}
                    onAccept={onAccept!}
                    onReject={onReject!}
                    onComplete={onComplete!}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
