// src/services/swapPointService.ts
import { supabase } from "./supabaseClient";

export interface SwapPoint {
  id: number;
  name: string;
  address: string;
  city?: string;
}

export async function fetchSwapPoints(): Promise<SwapPoint[]> {
  const { data, error } = await supabase
    .from("swap_points")
    .select("id, name, address");

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function addSwapPoint(newSwapPoint: {
  name: string;
  address: string;
}): Promise<void> {
  const { error } = await supabase.from("swap_points").insert([newSwapPoint]);

  if (error) throw error;
}
