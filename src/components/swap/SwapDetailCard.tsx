import { Button } from "../ui/Button";
import SwapChat from "./SwapChat";
import type { Swap } from "../../hooks/useSwaps";

interface Props {
  swap: Swap;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onComplete: (id: number) => void;
}

export default function SwapDetailCard({
  swap,
  onAccept,
  onReject,
  onComplete,
}: Props) {
  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        🌿 Plant Swap #{swap.id}
      </h2>

      {/* Plant thumbnails */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <img
            src={swap.sender_plant?.image_url || "/placeholder.jpg"}
            alt={swap.sender_plant?.nombre_comun}
            className="w-28 h-28 object-cover rounded-lg shadow"
          />
          <p className="text-sm mt-1">{swap.sender_plant?.nombre_comun}</p>
        </div>

        <div className="text-3xl">↔️</div>

        <div className="flex flex-col items-center">
          <img
            src={swap.receiver_plant?.image_url || "/placeholder.jpg"}
            alt={swap.receiver_plant?.nombre_comun}
            className="w-28 h-28 object-cover rounded-lg shadow"
          />
          <p className="text-sm mt-1">{swap.receiver_plant?.nombre_comun}</p>
        </div>
      </div>

      {/*  Swap status */}
      <div className="text-gray-700 dark:text-gray-300">
        <strong>Status: </strong>
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

      {/* 🔘 Action buttons */}
      {swap.status === "pending" && (
        <div className="flex gap-3">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onAccept(swap.id)}
          >
            Accept
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => onReject(swap.id)}
          >
            Reject
          </Button>
        </div>
      )}

      {/* 💬 Chat visible only when accepted */}
      {swap.status === "accepted" && (
        <>
          <SwapChat swapId={swap.id} />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onComplete(swap.id)}
          >
            Mark as Completed
          </Button>
        </>
      )}
    </div>
  );
}
