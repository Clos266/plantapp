import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export function useSwapChat(swapId: number, userId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar mensajes iniciales
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("swap_messages")
        .select("*")
        .eq("swap_id", swapId)
        .order("created_at", { ascending: true });

      if (error) console.error("Error fetching messages:", error);
      else setMessages(data || []);

      setLoading(false);
    };

    if (swapId) fetchMessages();
  }, [swapId]);

  // 🔹 Escuchar mensajes en tiempo real
  useEffect(() => {
    if (!swapId) return;

    const channel = supabase
      .channel(`swap_chat_${swapId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "swap_messages",
          filter: `swap_id=eq.${swapId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    // 🔹 Cleanup al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [swapId]);

  // 🔹 Enviar mensaje
  const sendMessage = async (text: string) => {
    const { error } = await supabase.from("swap_messages").insert([
      {
        swap_id: swapId,
        sender_id: userId,
        message: text,
      },
    ]);

    if (error) console.error("Error sending message:", error);
  };

  return { messages, sendMessage, loading };
}
