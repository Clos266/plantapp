// src/components/swap/SwapDetailBox.tsx
import { useState } from "react";
import { useSwapChat } from "../../hooks/useSwapChat";
import { useSwaps } from "../../hooks/useSwaps";
import type { Swap } from "../../hooks/useSwaps";
import { Button } from "../ui/Button";

interface Props {
  swap: Swap;
  userId: string;
}

export default function SwapDetailBox({ swap, userId }: Props) {
  const { acceptSwap, rejectSwap, completeSwap } = useSwaps();
  const {
    messages,
    sendMessage,
    loading: chatLoading,
  } = useSwapChat(swap.id, userId);
  const [input, setInput] = useState("");

  const isSender = swap.sender_id === userId;
  const isPending = swap.status === "pending";
  const isAccepted = swap.status === "accepted";

  // 🌱 Header section with plant info
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-2">
        🌿 Swap between{" "}
        <span className="text-green-600 font-bold">
          {swap.sender_plant?.nombre_comun || "Unknown Plant"}
        </span>{" "}
        and{" "}
        <span className="text-green-600 font-bold">
          {swap.receiver_plant?.nombre_comun || "Unknown Plant"}
        </span>
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Status:{" "}
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
      </p>

      {/* 🔸 Pending swap actions */}
      {isPending && swap.receiver_id === userId && (
        <div className="flex gap-3 mb-4">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => acceptSwap(swap.id)}
          >
            Accept
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => rejectSwap(swap.id)}
          >
            Reject
          </Button>
        </div>
      )}

      {/* 🔸 Accepted swaps: chat enabled */}
      {isAccepted && (
        <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
          <h3 className="font-medium mb-2">💬 Chat</h3>

          {chatLoading ? (
            <p>Loading chat...</p>
          ) : (
            <div className="flex flex-col h-64 bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
              <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                {messages.length === 0 && (
                  <p className="text-sm text-gray-500">No messages yet.</p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2 rounded-lg max-w-[70%] ${
                      m.sender_id === userId
                        ? "bg-green-500 text-white self-end ml-auto"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {m.message}
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (input.trim()) {
                    sendMessage(input.trim());
                    setInput("");
                  }
                }}
                className="flex gap-2"
              >
                <input
                  className="flex-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* 🔸 Completion button */}
          <div className="mt-4 text-right">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => completeSwap(swap.id)}
            >
              Mark as Completed
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
