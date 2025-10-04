import { useEffect, useState } from "react";
import { fetchPlantEvents } from "../services/plantService";
import {
  fetchUserEvents,
  addEvent as addEventService,
} from "../services/eventService";
import { fetchSwapPoints } from "../services/swapPointService";
import { supabase } from "../services/supabaseClient";
import type { SwapPoint } from "../services/swapPointService";

export function useCalendarEvents() {
  const [events, setEvents] = useState<{ title: string; start: any }[]>([]);
  const [swapPoints, setSwapPoints] = useState<SwapPoint[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    swap_point_id: "",
  });

  const loadEvents = async (userId: string) => {
    const [plantEvents, userEvents] = await Promise.all([
      fetchPlantEvents(userId),
      fetchUserEvents(userId),
    ]);
    setEvents([...plantEvents, ...userEvents]);
  };

  const addEvent = async () => {
    try {
      await addEventService(newEvent);
      setNewEvent({ title: "", date: "", swap_point_id: "" });

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) loadEvents(user.id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const loadSwapPoints = async () => {
    const data = await fetchSwapPoints();
    setSwapPoints(data || []);
  };

  useEffect(() => {
    loadSwapPoints();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) loadEvents(user.id);
    })();
  }, []);

  return { events, swapPoints, newEvent, setNewEvent, addEvent };
}
