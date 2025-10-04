// src/components/layouts/Calendar.tsx
import CalendarForm from "../forms/CalendarForm";
import CalendarView from "../../components/calendar/CalendarView";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";

export default function Calendar() {
  const { events, swapPoints, newEvent, setNewEvent, addEvent } =
    useCalendarEvents();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📅 Calendario</h1>

      {/* Formulario para añadir evento */}
      <CalendarForm
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        swapPoints={swapPoints}
        addEvent={addEvent}
      />

      {/* Calendario */}
      <CalendarView events={events} />
    </div>
  );
}
