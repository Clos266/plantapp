import { useState } from "react";
import { usePlants } from "../../hooks/usePlants";
import PlantForm from "../forms/PlantForm";
import PlantList from "./PlantList";
import { Button } from "../ui/Button";
import { Plus, X } from "lucide-react";

export default function Plants() {
  const { plants, add, update, remove, loading, error } = usePlants();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading plants...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className=" space-y-5 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header and toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          🌿 My Plants
        </h1>

        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          {showForm ? (
            <>
              <X className="w-5 h-5 text-red-600" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 text-green-600" /> New Plant
            </>
          )}
        </Button>
      </div>

      {/* Add plant form (hidden until toggle) */}
      {showForm && (
        <div className="transition-all duration-300">
          <PlantForm onAdd={add} />
        </div>
      )}

      {/* Plant list */}
      <PlantList
        plants={plants}
        onDelete={remove}
        onEdit={setEditingId}
        onUpdate={update}
        editingId={editingId}
        onCancelEdit={() => setEditingId(null)}
      />
    </div>
  );
}
