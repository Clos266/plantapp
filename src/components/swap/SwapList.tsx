// src/components/swap/SwapList.tsx
import type { Swap } from "../../hooks/useSwaps";
import { Button } from "../ui/Button";

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
          const otherPlant = isSender
            ? swap.receiver_plant?.nombre_comun
            : swap.sender_plant?.nombre_comun;

          return (
            <div
              key={swap.id}
              className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
            >
              <div>
                <p className="font-medium">
                  {isSender ? "📤 Sent" : "📥 Received"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {swap.sender_plant?.nombre_comun} ↔{" "}
                  {swap.receiver_plant?.nombre_comun}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
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

                {swap.status === "pending" && isSender === false && (
                  <div className="flex gap-2">
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1"
                      onClick={() => onAccept?.(swap.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
                      onClick={() => onReject?.(swap.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {swap.status === "accepted" && (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1"
                    onClick={() => onComplete?.(swap.id)}
                  >
                    Mark as completed
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
