import { useState } from "react";
import type { FullPlant } from "../../services/plantCrudService";
import { Button } from "../ui/Button";
import PlantEditCard from "./PlantEditCard";

interface Props {
  plants: FullPlant[];
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onUpdate?: (id: number, data: Partial<FullPlant>) => void;
  editingId?: number | null;
  onCancelEdit?: () => void;
  swapMode?: boolean;
  onProposeSwap?: (plant: FullPlant) => void;
}

export default function PlantList({
  plants,
  onDelete,
  onEdit,
  onUpdate,
  editingId = null,
  onCancelEdit,
  swapMode = false,
  onProposeSwap,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!plants.length)
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">
        No se encontraron plantas.
      </p>
    );

  return (
    <>
      <ul className="space-y-3">
        {plants.map((plant) => (
          <li key={plant.id}>
            {editingId === plant.id ? (
              <PlantEditCard
                plant={plant}
                onUpdate={onUpdate!}
                onCancel={onCancelEdit!}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-4 md:gap-6">
                {/* Imagen redondeada y clickeable */}
                <div
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() =>
                    plant.image_url && setSelectedImage(plant.image_url)
                  }
                >
                  <div className="relative w-24 h-24">
                    <img
                      src={plant.image_url || "/placeholder.png"}
                      alt={plant.nombre_comun}
                      className="w-full h-full object-cover rounded-full shadow-md border-2 border-green-200 hover:scale-105 hover:shadow-lg transition-transform duration-200 ease-in-out"
                    />
                  </div>
                </div>

                {/* Info planta */}
                <div className="flex-1 text-center md:text-left">
                  <p className="font-semibold">{plant.nombre_comun}</p>
                  {plant.nombre_cientifico && (
                    <p className="text-sm text-gray-500">
                      {plant.nombre_cientifico}
                    </p>
                  )}
                </div>

                {/* Botones: edit/delete o swap */}
                <div className="flex gap-2 mt-3 md:mt-0">
                  {swapMode ? (
                    <Button
                      variant="primary"
                      onClick={() => onProposeSwap?.(plant)}
                    >
                      Swap
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        onClick={() => onEdit?.(plant.id!)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => onDelete?.(plant.id!)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Modal para imagen ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Planta ampliada"
            className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl border border-gray-300 transition-transform duration-300 scale-100 hover:scale-105"
          />
        </div>
      )}
    </>
  );
}
