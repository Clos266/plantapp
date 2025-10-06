// src/hooks/useCalendarEvents.ts
import { useEffect, useState } from "react";
import { useSupabaseData } from "./useSupabaseData";
import { fetchSwapPoints } from "../services/swapPointService";
import type { SwapPoint } from "../services/swapPointService";
import { fetchPlantEvents } from "../services/plantService";
import {
  fetchUserEvents,
  addEvent as addEventService,
} from "../services/eventService";

export function useCalendarEvents() {
  const { userId } = useSupabaseData();
  const [events, setEvents] = useState<{ title: string; start: any }[]>([]);
  const [swapPoints, setSwapPoints] = useState<SwapPoint[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    swap_point_id: "",
  });

  async function loadEvents() {
    if (!userId) return;
    const [plantEvents, userEvents] = await Promise.all([
      fetchPlantEvents(userId),
      fetchUserEvents(userId),
    ]);
    setEvents([...plantEvents, ...userEvents]);
  }

  async function addEvent() {
    await addEventService(newEvent);
    setNewEvent({ title: "", date: "", swap_point_id: "" });
    loadEvents();
  }

  useEffect(() => {
    loadEvents();
    fetchSwapPoints().then(setSwapPoints);
  }, [userId]);

  return { events, swapPoints, newEvent, setNewEvent, addEvent };
}
