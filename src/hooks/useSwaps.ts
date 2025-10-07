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

  useEffect(() => {
    if (!userId) return;
    loadSwaps();
    loadPlants();
  }, [userId]);

  // 🔹 Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("swaps-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "swaps" },
        (payload) => {
          setSwaps((prev) => {
            const idx = prev.findIndex((s) => s.id === payload.new.id);
            if (payload.eventType === "INSERT") {
              return [payload.new as Swap, ...prev];
            } else if (payload.eventType === "UPDATE") {
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = payload.new as Swap;
                return updated;
              }
            } else if (payload.eventType === "DELETE") {
              return prev.filter((s) => s.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // 🔹 Load swaps for the current user
  async function loadSwaps() {
    if (!userId) return;
    setLoading(true);

    try {
      const { data: sentSwaps, error: sentError } = await supabase
        .from("swaps")
        .select(
          `
          id,
          status,
          created_at,
          updated_at,
          sender_plant_id,
          receiver_plant_id,
          swap_point_id,
          sender_plant:sender_plant_id ( id, nombre_comun, image_url ),
          receiver_plant:receiver_plant_id ( id, nombre_comun, image_url )
        `
        )
        .eq("sender_id", userId);

      if (sentError) throw sentError;

      const { data: receivedSwaps, error: recvError } = await supabase
        .from("swaps")
        .select(
          `
          id,
          status,
          created_at,
          updated_at,
          sender_plant_id,
          receiver_plant_id,
          swap_point_id,
          sender_plant:sender_plant_id ( id, nombre_comun, image_url ),
          receiver_plant:receiver_plant_id ( id, nombre_comun, image_url )
        `
        )
        .eq("receiver_id", userId);

      if (recvError) throw recvError;

      const combined = [...(sentSwaps || []), ...(receivedSwaps || [])].sort(
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

  // 🔹 Load available plants (from other users)
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
    setSwaps((prev) => [newSwap, ...prev]);
  }

  // 🔹 Accept a swap
  async function acceptSwap(id: number) {
    const updated = await updateRow<Swap>("swaps", id, { status: "accepted" });
    setSwaps((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  // 🔹 Reject a swap
  async function rejectSwap(id: number) {
    const updated = await updateRow<Swap>("swaps", id, { status: "rejected" });
    setSwaps((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  // 🔹 Mark a swap as completed → exchange plant ownership
  async function completeSwap(id: number) {
    try {
      // 1️⃣ Update the swap status
      const updated = await updateRow<Swap>("swaps", id, {
        status: "completed",
      });

      // 2️⃣ Fetch the involved plants
      const { data: swapData, error: swapError } = await supabase
        .from("swaps")
        .select("sender_plant_id, receiver_plant_id")
        .eq("id", id)
        .single();

      if (swapError || !swapData) throw swapError;

      // 3️⃣ Get their current owners
      const { data: plantsData, error: plantsError } = await supabase
        .from("plants")
        .select("id, user_id")
        .in("id", [swapData.sender_plant_id, swapData.receiver_plant_id]);

      if (plantsError || !plantsData || plantsData.length !== 2) {
        throw plantsError || new Error("Plants not found");
      }

      const senderPlant = plantsData.find(
        (p) => p.id === swapData.sender_plant_id
      );
      const receiverPlant = plantsData.find(
        (p) => p.id === swapData.receiver_plant_id
      );

      if (!senderPlant || !receiverPlant)
        throw new Error("Invalid plant IDs in swap");

      // 4️⃣ Swap the user_id values
      const { error: updateError1 } = await supabase
        .from("plants")
        .update({ user_id: receiverPlant.user_id })
        .eq("id", senderPlant.id);

      const { error: updateError2 } = await supabase
        .from("plants")
        .update({ user_id: senderPlant.user_id })
        .eq("id", receiverPlant.id);

      if (updateError1 || updateError2) throw updateError1 || updateError2;

      // 5️⃣ Update local state
      setSwaps((prev) => prev.map((s) => (s.id === id ? updated : s)));

      console.log("✅ Plants successfully swapped between users!");
    } catch (err) {
      console.error("Error completing swap:", err);
    }
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
