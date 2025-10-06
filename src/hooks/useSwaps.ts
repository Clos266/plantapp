// src/hooks/useSwaps.ts
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
  status: "pendiente" | "aceptado" | "rechazado" | "completado";
  created_at: string;
  updated_at: string;
}

export function useSwaps() {
  const { userId, loading, error, insertRow } = useSupabaseData();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [plants, setPlants] = useState<FullPlant[]>([]);

  useEffect(() => {
    if (userId) loadSwaps();
  }, [userId]);

  async function loadSwaps() {
    if (!userId) return;

    try {
      // 🔹 Cargar plantas disponibles de otros usuarios
      const { data: otherPlants, error: plantsError } = await supabase
        .from("plants")
        .select("*")
        .neq("user_id", userId)
        .eq("disponible", true);

      if (plantsError) throw plantsError;

      // 🔹 Swaps enviados por el usuario
      const { data: sentSwaps, error: sentError } = await supabase
        .from("swaps")
        .select(
          `
        id,
        status,
        created_at,
        updated_at,
        sender_id,
        receiver_id,
        sender_plant:sender_plant_id (
          id, nombre_comun, image_url
        ),
        receiver_plant:receiver_plant_id (
          id, nombre_comun, image_url
        )
      `
        )
        .eq("sender_id", userId);

      if (sentError) throw sentError;

      // 🔹 Swaps recibidos por el usuario
      const { data: receivedSwaps, error: recvError } = await supabase
        .from("swaps")
        .select(
          `
        id,
        status,
        created_at,
        updated_at,
        sender_id,
        receiver_id,
        sender_plant:sender_plant_id (
          id, nombre_comun, image_url
        ),
        receiver_plant:receiver_plant_id (
          id, nombre_comun, image_url
        )
      `
        )
        .eq("receiver_id", userId);

      if (recvError) throw recvError;

      // 🔹 Combinar y ordenar por fecha
      const allSwaps = [...(sentSwaps || []), ...(receivedSwaps || [])].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      setPlants(otherPlants || []);
      setSwaps(allSwaps);
    } catch (err) {
      console.error("Error loading swaps:", err);
    }
  }

  async function createSwap(
    payload: Omit<Swap, "id" | "created_at" | "updated_at">
  ) {
    const newSwap = await insertRow("swaps", payload);
    setSwaps((prev) => [newSwap, ...prev]);
  }

  return { swaps, plants, loading, error, createSwap };
}
