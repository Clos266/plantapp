// src/hooks/useSwapChat.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export function useSwapChat(swapId: number, userId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!swapId) return;
    loadMessages();

    const channel = supabase
      .channel(`swap_messages_${swapId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "swap_messages",
          filter: `swap_id=eq.${swapId}`,
        },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [swapId]);

  async function loadMessages() {
    const { data, error } = await supabase
      .from("swap_messages")
      .select("*, sender_id")
      .eq("swap_id", swapId)
      .order("created_at", { ascending: true });
    if (!error) setMessages(data || []);
    setLoading(false);
  }

  async function sendMessage(content: string) {
    await supabase
      .from("swap_messages")
      .insert([{ swap_id: swapId, sender_id: userId, message: content }]);
  }

  return { messages, sendMessage, loading };
}
