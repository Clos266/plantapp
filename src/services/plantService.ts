import { supabase } from "./supabaseClient";
import { addDays, formatISO } from "date-fns";

interface Plant {
  id: number;
  nombre_comun: string;
  last_watered?: string;
  interval_days?: number;
}

export async function fetchPlantEvents(userId: string) {
  const { data: plants, error } = await supabase
    .from("plants")
    .select("id, nombre_comun, last_watered, interval_days")
    .eq("user_id", userId);

  if (error) throw error;

  return (
    plants?.flatMap((plant: Plant) => {
      const interval = plant.interval_days || 7;
      let last = plant.last_watered ? new Date(plant.last_watered) : new Date();
      const evs = [];
      for (let i = 0; i < 5; i++) {
        last = addDays(last, interval);
        evs.push({
          title: `💧 Regar ${plant.nombre_comun}`,
          start: formatISO(last, { representation: "date" }),
        });
      }
      return evs;
    }) || []
  );
}
