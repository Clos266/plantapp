import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useSupabaseData } from "./useSupabaseData";

export interface SwapMessage {
  id: number;
  swap_id: number;
  sender_id: string;
  message: string;
  created_at: string;
}

export function useSwapChat(swapId: number | null) {
  const { userId } = useSupabaseData();
  const [messages, setMessages] = useState<SwapMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing messages
  useEffect(() => {
    if (!swapId) return;
    setLoading(true);

    supabase
      .from("swap_messages")
      .select("*")
      .eq("swap_id", swapId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setMessages(data);
        setLoading(false);
      });
  }, [swapId]);

  // Subscribe to new messages in real-time
  useEffect(() => {
    if (!swapId) return;

    const channel = supabase
      .channel(`swap-messages-${swapId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "swap_messages",
          filter: `swap_id=eq.${swapId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as SwapMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [swapId]);

  // Send a new message
  async function sendMessage(text: string) {
    if (!swapId || !userId || !text.trim()) return;
    await supabase
      .from("swap_messages")
      .insert([{ swap_id: swapId, sender_id: userId, message: text.trim() }]);
  }

  return { messages, sendMessage, loading };
}
