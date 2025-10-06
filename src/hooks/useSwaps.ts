import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useSupabaseData } from "./useSupabaseData";
import type { FullPlant } from "../services/plantCrudService";

export interface Swap {
  id: number;
  sender_id: string;
  receiver_id: string;
  sender_plant_id: number;
  receiver_plant_id: number;
  swap_point_id: number | null;
  status: "pending" | "accepted" | "rejected" | "completed";
  created_at: string;
  updated_at: string;
  sender_plant?: Partial<FullPlant>;
  receiver_plant?: Partial<FullPlant>;
}

export function useSwaps() {
  const { userId, insertRow, updateRow } = useSupabaseData();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [plants, setPlants] = useState<FullPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Load swaps and plants when user is ready
  useEffect(() => {
    if (!userId) return;
    loadSwaps();
    loadPlants();
  }, [userId]);

  // 🔹 Real-time subscription for live updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("swaps-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "swaps" },
        (payload) => {
          setSwaps((prev) => {
            const idx = prev.findIndex((s) => s.id === payload.new?.id);

            switch (payload.eventType) {
              case "INSERT":
                return [payload.new as Swap, ...prev];
              case "UPDATE":
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = payload.new as Swap;
                  return updated;
                }
                return prev;
              case "DELETE":
                return prev.filter((s) => s.id !== payload.old?.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // 🔹 Fetch swaps for the current user
  async function loadSwaps() {
    if (!userId) return;
    setLoading(true);

    try {
      const [sent, received] = await Promise.all([
        supabase
          .from("swaps")
          .select(
            `
            id,
            status,
            created_at,
            updated_at,
            sender_id,
            receiver_id,
            swap_point_id,
            sender_plant:sender_plant_id ( id, nombre_comun, image_url ),
            receiver_plant:receiver_plant_id ( id, nombre_comun, image_url )
          `
          )
          .eq("sender_id", userId),
        supabase
          .from("swaps")
          .select(
            `
            id,
            status,
            created_at,
            updated_at,
            sender_id,
            receiver_id,
            swap_point_id,
            sender_plant:sender_plant_id ( id, nombre_comun, image_url ),
            receiver_plant:receiver_plant_id ( id, nombre_comun, image_url )
          `
          )
          .eq("receiver_id", userId),
      ]);

      if (sent.error) throw sent.error;
      if (received.error) throw received.error;

      const combined = [...(sent.data || []), ...(received.data || [])].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      setSwaps(combined);
    } catch (err: any) {
      console.error("Error loading swaps:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Load available plants from other users
  async function loadPlants() {
    if (!userId) return;
    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .neq("user_id", userId)
      .eq("disponible", true);

    if (!error && data) setPlants(data);
  }

  // 🔹 Create a new swap
  async function createSwap(payload: {
    receiver_id: string;
    sender_plant_id: number;
    receiver_plant_id: number;
    swap_point_id?: number;
  }) {
    if (!userId) throw new Error("User not authenticated");

    const newSwap = await insertRow<Swap>("swaps", {
      sender_id: userId,
      receiver_id: payload.receiver_id,
      sender_plant_id: payload.sender_plant_id,
      receiver_plant_id: payload.receiver_plant_id,
      swap_point_id: payload.swap_point_id ?? null,
      status: "pending",
    });

    if (newSwap) setSwaps((prev) => [newSwap, ...prev]);
  }

  // 🔹 Accept / Reject / Complete helpers
  async function acceptSwap(id: number) {
    const updated = await updateRow<Swap>("swaps", id, { status: "accepted" });
    if (updated)
      setSwaps((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  async function rejectSwap(id: number) {
    const updated = await updateRow<Swap>("swaps", id, { status: "rejected" });
    if (updated)
      setSwaps((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  async function completeSwap(id: number) {
    const updated = await updateRow<Swap>("swaps", id, { status: "completed" });
    if (updated)
      setSwaps((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  return {
    swaps,
    plants,
    loading,
    error,
    createSwap,
    acceptSwap,
    rejectSwap,
    completeSwap,
    reload: loadSwaps,
  };
}
