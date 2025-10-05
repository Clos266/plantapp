import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import {
  getUserPlants,
  addPlant,
  updatePlant,
  deletePlant,
} from "../services/plantCrudService";
import type { FullPlant } from "../services/plantCrudService";
import toast from "react-hot-toast";

export function usePlants() {
  const [plants, setPlants] = useState<FullPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load authenticated user once
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      setUserId(data.user.id);
    })();
  }, []);

  // Fetch plants when user is ready
  useEffect(() => {
    if (userId) fetchPlants(userId);
  }, [userId]);

  async function fetchPlants(uid: string) {
    setLoading(true);
    try {
      const data = await getUserPlants(uid);
      setPlants(data);
    } catch (err: any) {
      console.error("Error fetching plants:", err);
      setError(err.message);
      toast.error("Failed to load plants 🌱");
    } finally {
      setLoading(false);
    }
  }

  async function add(
    newPlant: Omit<FullPlant, "id" | "user_id" | "created_at">
  ) {
    if (!userId) throw new Error("User not authenticated");
    try {
      const plant = await addPlant({ ...newPlant, user_id: userId });
      setPlants((prev) => [plant, ...prev]);
      toast.success("Plant added successfully 🌿");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add plant ❌");
    }
  }

  async function update(id: number, updates: Partial<FullPlant>) {
    try {
      const updated = await updatePlant(id, updates);
      setPlants((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success("Plant updated 🌱");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update plant ❌");
    }
  }

  // 🗑️ Delete with confirmation toast
  async function remove(id: number) {
    toast((t) => (
      <div className="flex flex-col gap-2 text-sm">
        <span>Are you sure you want to delete this plant?</span>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              deletePlant(id)
                .then(() => {
                  setPlants((prev) => prev.filter((p) => p.id !== id));
                  toast.success("Plant deleted ❌");
                })
                .catch(() => toast.error("Failed to delete plant ❌"))
                .finally(() => toast.dismiss(t.id));
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  }

  // ✅ Return everything needed by components
  return { plants, loading, error, add, update, remove, fetchPlants };
}
