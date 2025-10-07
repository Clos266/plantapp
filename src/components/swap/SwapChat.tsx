import { useState, useRef, useEffect } from "react";
import { useSwapChat } from "../../hooks/useSwapChat";
import { supabase } from "../../services/supabaseClient";

export default function ChatBox({ swapId }: { swapId: number }) {
  const [userId, setUserId] = useState<string | null>(null);
  const { messages, sendMessage, loading } = useSwapChat(swapId, userId ?? "");
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Obtener userId del usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Error getting user:", error);
      else setUserId(data.user?.id || null);
    };
    fetchUser();
  }, []);

  // 🔹 Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading)
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center">
        Loading chat...
      </p>
    );

  if (!userId)
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center">
        Loading user...
      </p>
    );

  return (
    <div className="flex flex-col h-80 bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-2">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No messages yet — start the conversation 🌿
          </p>
        )}

        {messages.map((m) => {
          const isMine = m.sender_id === userId;

          return (
            <div
              key={m.id}
              className={`flex flex-col ${
                isMine ? "items-end text-right" : "items-start text-left"
              }`}
            >
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {isMine ? "You" : "User"}
              </span>
              <div
                className={`p-2 rounded-lg max-w-[70%] break-words shadow-sm ${
                  isMine
                    ? "bg-green-500 text-white self-end"
                    : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                }`}
              >
                {m.message}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage(input.trim());
            setInput("");
          }
        }}
        className="flex flex-col sm:flex-row gap-2 mt-2"
      >
        <input
          className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 
               dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-green-500 
               outline-none w-full"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg 
               transition-colors w-full sm:w-auto"
        >
          Send
        </button>
      </form>
    </div>
  );
}
