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
                  size="sm"
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
              <div className="flex flex-col gap-1 mt-2">
                <Button variant="primary" onClick={() => onEdit(plant.id!)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => onDelete(plant.id!)}>
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
