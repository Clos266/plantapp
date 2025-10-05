import { useState } from "react";
import type { FullPlant } from "../../services/plantCrudService";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface PlantEditCardProps {
  plant: FullPlant;
  onUpdate: (id: number, data: Partial<FullPlant>) => void;
  onCancel: () => void;
}

export default function PlantEditCard({
  plant,
  onUpdate,
  onCancel,
}: PlantEditCardProps) {
  const [editData, setEditData] = useState<Partial<FullPlant>>(plant);
  const [saving, setSaving] = useState(false);

  const handleChange = (key: keyof FullPlant, value: any) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!plant.id) return;
    setSaving(true);
    try {
      await onUpdate(plant.id, editData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 w-full space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Edit Plant
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          type="text"
          placeholder="Common name"
          value={editData.nombre_comun || ""}
          onChange={(e) => handleChange("nombre_comun", e.target.value)}
        />
        <Input
          type="text"
          placeholder="Scientific name"
          value={editData.nombre_cientifico || ""}
          onChange={(e) => handleChange("nombre_cientifico", e.target.value)}
        />
        <Input
          type="text"
          placeholder="Species"
          value={editData.especie || ""}
          onChange={(e) => handleChange("especie", e.target.value)}
        />
        <Input
          type="text"
          placeholder="Family"
          value={editData.familia || ""}
          onChange={(e) => handleChange("familia", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Watering interval (days)"
          value={editData.interval_days ?? ""}
          onChange={(e) =>
            handleChange("interval_days", Number(e.target.value))
          }
        />
        <Input
          type="date"
          placeholder="Last watered"
          value={editData.last_watered || ""}
          onChange={(e) => handleChange("last_watered", e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={!!editData.disponible}
          onChange={(e) => handleChange("disponible", e.target.checked)}
        />
        Available for swap
      </label>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
      </div>
    </div>
  );
}
