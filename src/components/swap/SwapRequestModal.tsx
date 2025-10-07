import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import toast from "react-hot-toast";
import type { FullPlant } from "../../services/plantCrudService";
import type { SwapPoint } from "../../services/swapPointService";
import { usePlants } from "../../hooks/usePlants";
import { useSwaps } from "../../hooks/useSwaps";
import { useSupabaseData } from "../../hooks/useSupabaseData";
import { fetchSwapPoints } from "../../services/swapPointService";

interface Props {
  open: boolean;
  onClose: () => void;
  plant: FullPlant | null;
  onSubmit: (swapData: any) => Promise<void>;
}

export default function SwapRequestModal({ open, onClose, plant }: Props) {
  const { userId } = useSupabaseData();
  const { plants: myPlants } = usePlants();
  const { createSwap } = useSwaps();

  const [swapPoints, setSwapPoints] = useState<SwapPoint[]>([]);
  const [selectedMyPlant, setSelectedMyPlant] = useState<number | null>(null);
  const [selectedSwapPoint, setSelectedSwapPoint] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Load swap points
  useEffect(() => {
    (async () => {
      const data = await fetchSwapPoints();
      if (data) setSwapPoints(data);
    })();
  }, []);

  if (!open || !plant) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !selectedMyPlant || !selectedSwapPoint) {
      toast.error("Please select your plant and a swap point.");
      return;
    }

    if (!plant) {
      toast.error("Missing plant data.");
      return;
    }

    if (!plant.user_id) {
      toast.error("Receiver has no valid user ID.");
      return;
    }

    setLoading(true);
    try {
      await createSwap({
        receiver_id: plant.user_id,
        sender_plant_id: selectedMyPlant,
        receiver_plant_id: plant.id!,
        swap_point_id: selectedSwapPoint,
      });

      toast.success("Swap request sent successfully 🌿");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to send swap request ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Propose swap with{" "}
        <span className="text-green-600">{plant.nombre_comun}</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🌱 Your plant */}
        <div>
          <label className="block text-sm font-medium mb-1">Your plant</label>
          <select
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
            value={selectedMyPlant ?? ""}
            onChange={(e) => setSelectedMyPlant(Number(e.target.value))}
          >
            <option value="">Select one of your plants</option>
            {myPlants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre_comun}
              </option>
            ))}
          </select>
        </div>

        {/* 📍 Swap point */}
        <div>
          <label className="block text-sm font-medium mb-1">Swap point</label>
          <select
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
            value={selectedSwapPoint ?? ""}
            onChange={(e) => setSelectedSwapPoint(Number(e.target.value))}
          >
            <option value="">Select a meeting point</option>
            {swapPoints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} – {s.city}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
