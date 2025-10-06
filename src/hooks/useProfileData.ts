// src/hooks/useProfileData.ts
import { useEffect, useState } from "react";
import { useSupabaseData } from "./useSupabaseData";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../services/profileService";
import { fetchUserEvents } from "../services/eventService";
import { fetchPlantEvents } from "../services/plantService";

export function useProfileData() {
  const { userId } = useSupabaseData();
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    loadData();
  }, [userId]);

  async function loadData() {
    try {
      setLoading(true);
      const [profileData, userEvents, plantEvents] = await Promise.all([
        fetchUserProfile(userId!),
        fetchUserEvents(userId!),
        fetchPlantEvents(userId!),
      ]);
      setProfile(profileData);
      setEvents(userEvents);
      setPlants(plantEvents);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(updates: any) {
    if (!userId) return;
    await updateUserProfile(userId, updates);
    setProfile((prev: any) => ({ ...prev, ...updates }));
  }

  const calculatePendingWaterings = () => {
    const today = new Date();
    return plants.filter((p) => new Date(p.start) <= today).length;
  };

  return {
    profile,
    events,
    plants,
    loading,
    saveProfile,
    calculatePendingWaterings,
  };
}
