// src/services/eventService.ts
import { supabase } from "./supabaseClient";

interface DBEvent {
  id?: number;
  title: string;
  date: string;
  swap_point_id?: string | null;
  location?: string;
}

export async function fetchUserEvents(userId: string) {
  const { data: userEvents, error } = await supabase
    .from("events")
    .select(
      "id, title, date, location, swap_point_id, swap_points(name, address)"
    )
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return [];
  }

  return (
    userEvents?.map((ev: any) => ({
      title: `${ev.title} 📍 ${ev.swap_points?.name || ev.location}`,
      start: ev.date,
    })) || []
  );
}

export async function addEvent(newEvent: DBEvent) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user logged in");

  const { error } = await supabase.from("events").insert([
    {
      user_id: user.id,
      title: newEvent.title,
      date: newEvent.date,
      swap_point_id: newEvent.swap_point_id || null,
      location: newEvent.location || "Custom location",
    },
  ]);

  if (error) throw error;
}
