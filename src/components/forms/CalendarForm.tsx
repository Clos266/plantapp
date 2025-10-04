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
  return (
    <div className="mb-6 p-4 border rounded">
      <h2 className="font-semibold mb-2">➕ Añadir evento</h2>
      <input
        type="text"
        placeholder="Título"
        className="border p-2 mr-2"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
      />
      <input
        type="date"
        className="border p-2 mr-2"
        value={newEvent.date}
        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
      />
      <select
        className="border p-2 mr-2"
        value={newEvent.swap_point_id}
        onChange={(e) =>
          setNewEvent({ ...newEvent, swap_point_id: e.target.value })
        }
      >
        <option value="">Selecciona swap point</option>
        {swapPoints.map((sp) => {
          const city = sp.address.split(",").pop()?.trim() || "";
          return (
            <option key={sp.id} value={sp.id}>
              {sp.name} ({city})
            </option>
          );
        })}
      </select>
      <button
        onClick={addEvent}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </div>
  );
}
