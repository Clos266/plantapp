// src/components/layouts/Calendar.tsx
import CalendarForm from "../forms/CalendarForm";
import CalendarView from "../../components/calendar/CalendarView";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";

export default function Calendar() {
  const { events, swapPoints, newEvent, setNewEvent, addEvent } =
    useCalendarEvents();

  return (
    <div className="p-4">
      {/* Header con título y botón */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-2xl font-bold text-gray-800 dark:text-gray-100-gray-800 dark:text-gray-100">
          📅 Calendar
        </h1>
        {/* Formulario para añadir evento */}
        <CalendarForm
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          swapPoints={swapPoints}
          addEvent={addEvent}
        />
      </div>

      {/* Vista del calendario */}
      <CalendarView events={events} />
    </div>
  );
}
