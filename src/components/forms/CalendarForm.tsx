import { useState } from "react";
import { Button } from "../ui/Button";
import { Plus, X } from "lucide-react";

interface CalendarFormProps {
  newEvent: { title: string; date: string; swap_point_id: string };
  setNewEvent: Function;
  swapPoints: { id: number; name: string; address: string }[];
  addEvent: () => void;
}

export default function CalendarForm({
  newEvent,
  setNewEvent,
  swapPoints,
  addEvent,
}: CalendarFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      {/* Botón para abrir/cerrar el formulario */}
      <Button
        variant="primary"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {isOpen ? (
          <>
            <X className="w-5 h-5 text-red-600" /> Cancel
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 text-green-600" /> New Event
          </>
        )}
      </Button>

      {/* Formulario desplegable */}
      {isOpen && (
        <div className="mt-4 p-4 border rounded bg-white dark:bg-gray-800 shadow">
          <h2 className="font-semibold mb-2">Add Event</h2>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Title"
              className="border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />

            <input
              type="date"
              className="border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
            />

            <select
              className="border p-2 rounded dark:bg-gray-700 dark:text-white"
              value={newEvent.swap_point_id}
              onChange={(e) =>
                setNewEvent({ ...newEvent, swap_point_id: e.target.value })
              }
            >
              <option value="">Select swap point</option>
              {swapPoints.map((sp) => {
                const city = sp.address.split(",").pop()?.trim() || "";
                return (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} ({city})
                  </option>
                );
              })}
            </select>

            <Button variant="secondary" onClick={addEvent}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
