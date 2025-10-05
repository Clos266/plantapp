// src/services/plantCrudService.ts
import { supabase } from "./supabaseClient";

export interface FullPlant {
  id?: number;
  created_at?: string;
  user_id?: string;
  nombre_comun: string;
  nombre_cientifico?: string;
  especie?: string;
  familia?: string;
  disponible?: boolean;
  interval_days?: number;
  last_watered?: string;
  image_url?: string;
}

/** ✅ Fetch all plants for a given user */
export async function getUserPlants(userId: string): Promise<FullPlant[]> {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/** ✅ Create a new plant */
export async function addPlant(plant: Omit<FullPlant, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("plants")
    .insert([plant])
    .select();
  if (error) throw error;
  return data?.[0];
}

/** ✅ Update an existing plant */
export async function updatePlant(id: number, updates: Partial<FullPlant>) {
  const { data, error } = await supabase
    .from("plants")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data?.[0];
}

/** ✅ Delete plant */
export async function deletePlant(id: number) {
  const { error } = await supabase.from("plants").delete().eq("id", id);
  if (error) throw error;
}
