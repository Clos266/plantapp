import ImageUpload from "../ImageUpload";
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

  /** 🔹 Si está activo, muestra botón "swap " en lugar de editar/borrar */
  swapMode?: boolean;

  /** 🔹 Función llamada al hacer clic en "swap intercambio" */
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
  if (!plants.length)
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">
        No se encontraron plantas.
      </p>
    );

  return (
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
              {/* Imagen clickeable igual que avatar */}
              <div className="flex-shrink-0">
                <ImageUpload
                  folder="plants"
                  size="sm"
                  initialUrl={plant.image_url}
                  onUpload={(url) => onUpdate?.(plant.id!, { image_url: url })}
                  clickablePreview
                />
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
  );
}
