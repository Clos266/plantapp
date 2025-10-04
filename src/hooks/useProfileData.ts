// src/hooks/useProfileData.ts
import { useEffect, useState } from "react";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../services/profileService";
import { fetchUserEvents } from "../services/eventService";
import { fetchPlantEvents } from "../services/plantService";

export function useProfileData(user: any) {
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const [profileData, userEvents, plantEvents] = await Promise.all([
          fetchUserProfile(user.id),
          fetchUserEvents(user.id),
          fetchPlantEvents(user.id),
        ]);

        setProfile(profileData);
        setEvents(userEvents);
        setPlants(plantEvents);
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const saveProfile = async (updates: any) => {
    if (!user) return;
    try {
      await updateUserProfile(user.id, updates);
      setProfile((prev: any) => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const calculatePendingWaterings = () => {
    const today = new Date();
    return plants.filter((p) => {
      const last = new Date(p.start);
      return new Date(last) <= today;
    }).length;
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
