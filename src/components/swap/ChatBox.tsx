import { useState } from "react";
import { useSwapChat } from "../../hooks/useSwapChat";

export default function ChatBox({
  swapId,
  userId,
}: {
  swapId: number;
  userId: string;
}) {
  const { messages, sendMessage, loading } = useSwapChat(swapId, userId);
  const [input, setInput] = useState("");

  if (loading) return <p>Cargando chat...</p>;

  return (
    <div className="flex flex-col h-80 bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
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
          if (input.trim()) sendMessage(input.trim());
          setInput("");
        }}
        className="flex gap-2"
      >
        <input
          className="flex-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-gray-100"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
          Enviar
        </button>
      </form>
    </div>
  );
}
