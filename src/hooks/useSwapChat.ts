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

export function useSwapChat(swapId: number | null, userId?: string) {
  const { userId: authUserId } = useSupabaseData();
  const currentUserId = userId || authUserId;

  const [messages, setMessages] = useState<SwapMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch existing messages
  useEffect(() => {
    if (!swapId) return;
    setLoading(true);

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("swap_messages")
        .select("*")
        .eq("swap_id", swapId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }

      setLoading(false);
    };

    fetchMessages();
  }, [swapId]);

  // 🔹 Real-time subscription for new messages
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
          const newMessage = payload.new as SwapMessage;
          setMessages((prev) => {
            // Prevent duplicates (sometimes happens on fast inserts)
            const exists = prev.some((m) => m.id === newMessage.id);
            return exists ? prev : [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [swapId]);

  // 🔹 Send a new message
  async function sendMessage(text: string) {
    if (!swapId || !currentUserId || !text.trim()) return;

    const { error } = await supabase.from("swap_messages").insert([
      {
        swap_id: swapId,
        sender_id: currentUserId,
        message: text.trim(),
      },
    ]);

    if (error) console.error("Error sending message:", error);
  }

  return { messages, sendMessage, loading };
}
