// src/hooks/usePlants.ts
import { useEffect, useState } from "react";
import { useSupabaseData } from "./useSupabaseData";
import type { FullPlant } from "../services/plantCrudService";
import toast from "react-hot-toast";

export function usePlants() {
  const {
    userId,
    fetchTable,
    insertRow,
    updateRow,
    deleteRow,
    loading,
    error,
  } = useSupabaseData();
  const [plants, setPlants] = useState<FullPlant[]>([]);

  useEffect(() => {
    if (userId) loadPlants();
  }, [userId]);

  async function loadPlants() {
    try {
      const data = await fetchTable<FullPlant>("plants", { user_id: userId });
      setPlants(data);
    } catch (err: any) {
      console.error("Error fetching plants:", err);
      toast.error("Failed to load plants 🌱");
    }
  }

  async function add(
    newPlant: Omit<FullPlant, "id" | "user_id" | "created_at">
  ) {
    try {
      const plant = await insertRow<FullPlant>("plants", {
        ...newPlant,
        user_id: userId,
      });
      setPlants((prev) => [plant, ...prev]);
      toast.success("Plant added successfully 🌿");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add plant ❌");
    }
  }

  async function update(id: number, updates: Partial<FullPlant>) {
    try {
      const updated = await updateRow<FullPlant>("plants", id, updates);
      setPlants((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success("Plant updated 🌱");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update plant ❌");
    }
  }

  async function remove(id: number) {
    toast((t) => (
      <div className="flex flex-col gap-2 text-sm">
        <span>Are you sure you want to delete this plant?</span>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              try {
                await deleteRow("plants", id);
                setPlants((prev) => prev.filter((p) => p.id !== id));
                toast.success("Plant deleted 🌿");
              } catch {
                toast.error("Failed to delete plant ❌");
              } finally {
                toast.dismiss(t.id);
              }
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

  return { plants, loading, error, add, update, remove, loadPlants };
}
