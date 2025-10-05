import ImageUpload from "../ImageUpload";
import type { FullPlant } from "../../services/plantCrudService";
import { Button } from "../ui/Button";
import PlantEditCard from "./PlantEditCard";

interface Props {
  plants: FullPlant[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onUpdate: (id: number, data: Partial<FullPlant>) => void;
  editingId: number | null;
  onCancelEdit: () => void;
}

export default function PlantList({
  plants,
  onDelete,
  onEdit,
  onUpdate,
  editingId,
  onCancelEdit,
}: Props) {
  if (!plants.length)
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">
        No plants found.
      </p>
    );

  return (
    <ul className="space-y-3">
      {plants.map((plant) => (
        <li key={plant.id}>
          {editingId === plant.id ? (
            <PlantEditCard
              plant={plant}
              onUpdate={onUpdate}
              onCancel={onCancelEdit}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 w-full flex items-center justify-between gap-5">
              {/* Imagen clickeable igual que avatar */}
              <div className="flex-shrink-0">
                <ImageUpload
                  folder="plants"
                  initialUrl={plant.image_url}
                  onUpload={(url) => onUpdate(plant.id!, { image_url: url })}
                  clickablePreview
                />
              </div>

              {/* Info planta */}
              <div className="flex-1">
                <p className="font-semibold">{plant.nombre_comun}</p>
                {plant.nombre_cientifico && (
                  <p className="text-sm text-gray-500">
                    {plant.nombre_cientifico}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-1 mt-2">
                <Button
                  variant="secondary"
                  onClick={() => onEdit(plant.id!)}
                  className="rounded-lg text-sm px-3 py-1.5 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(plant.id!)}
                  className="rounded-lg text-sm px-3 py-1.5 bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
