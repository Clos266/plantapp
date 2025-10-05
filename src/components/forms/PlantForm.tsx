// src/components/forms/PlantForm.tsx
import { useState } from "react";
import { Button } from "../ui/Button";
import ImageUpload from "../ImageUpload";
import toast from "react-hot-toast";

interface PlantFormProps {
  onAdd: (plant: any) => Promise<void>;
}

export default function PlantForm({ onAdd }: PlantFormProps) {
  const [plant, setPlant] = useState({
    nombre_comun: "",
    nombre_cientifico: "",
    especie: "",
    familia: "",
    disponible: true,
    interval_days: 7,
    last_watered: new Date().toISOString().slice(0, 10),
    image_url: "",
  });

  const handleChange = (key: keyof typeof plant, value: any) => {
    setPlant((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = async () => {
    if (!plant.nombre_comun.trim()) {
      toast.error("Common name is required 🌱");
      return;
    }

    try {
      await onAdd(plant);
      toast.success("Plant added successfully 🌿");

      setPlant({
        nombre_comun: "",
        nombre_cientifico: "",
        especie: "",
        familia: "",
        disponible: true,
        interval_days: 7,
        last_watered: new Date().toISOString().slice(0, 10),
        image_url: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error adding plant ❌");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-3">
      <input
        type="text"
        placeholder="Common name"
        value={plant.nombre_comun}
        onChange={(e) => handleChange("nombre_comun", e.target.value)}
        className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
      />

      <input
        type="text"
        placeholder="Scientific name"
        value={plant.nombre_cientifico}
        onChange={(e) => handleChange("nombre_cientifico", e.target.value)}
        className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
      />

      <input
        type="text"
        placeholder="Species"
        value={plant.especie}
        onChange={(e) => handleChange("especie", e.target.value)}
        className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
      />

      <input
        type="text"
        placeholder="Family"
        value={plant.familia}
        onChange={(e) => handleChange("familia", e.target.value)}
        className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
      />

      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
        <input
          type="checkbox"
          checked={plant.disponible}
          onChange={(e) => handleChange("disponible", e.target.checked)}
        />
        <span>Available for swap</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Watering interval (days)"
          value={plant.interval_days}
          onChange={(e) =>
            handleChange("interval_days", Number(e.target.value))
          }
          className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="date"
          placeholder="Last watered"
          value={plant.last_watered}
          onChange={(e) => handleChange("last_watered", e.target.value)}
          className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      <ImageUpload
        folder="plants"
        initialUrl={plant.image_url}
        onUpload={(url) => handleChange("image_url", url)}
      />

      <Button onClick={handleAdd}>Add Plant</Button>
    </div>
  );
}
