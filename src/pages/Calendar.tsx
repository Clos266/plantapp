import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { supabase } from "../supabaseClient";
import { addDays, formatISO } from "date-fns";

interface Plant {
  id: number;
  nombre_comun: string;
  last_watered?: string;
  interval_days?: number;
}

interface SwapPoint {
  id: number;
  name: string;
  address: string;
}

interface DBEvent {
  id: number;
  title: string;
  date: string;
  location?: string;
  swap_point_id?: number;
  swap_points?: { name: string; address: string } | null;
}

interface CalendarEvent {
  title: string;
  start: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [swapPoints, setSwapPoints] = useState<SwapPoint[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    swap_point_id: "",
  });

  // Cargar plantas → eventos de riego
  const fetchPlantEvents = async (userId: string) => {
    const { data: plants, error } = await supabase
      .from("plants")
      .select("id, nombre_comun, last_watered, interval_days")
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      return [];
    }

    return (
      plants?.flatMap((plant: Plant) => {
        const interval = plant.interval_days || 7;
        let last = plant.last_watered
          ? new Date(plant.last_watered)
          : new Date();
        const evs = [];
        for (let i = 0; i < 5; i++) {
          last = addDays(last, interval);
          evs.push({
            title: `💧 Regar ${plant.nombre_comun}`,
            start: formatISO(last, { representation: "date" }),
          });
        }
        return evs;
      }) || []
    );
  };

  // Cargar eventos del usuario
  const fetchUserEvents = async (userId: string) => {
    const { data: userEvents, error } = await supabase
      .from("events")
      .select(
        "id, title, date, location, swap_point_id, swap_points(name, address)"
      )
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      return [];
    }

    return (
      userEvents?.map((ev: DBEvent) => ({
        title: `${ev.title} 📍 ${ev.swap_points?.name || ev.location}`,
        start: ev.date,
      })) || []
    );
  };

  // Cargar swap points para el dropdown
  const fetchSwapPoints = async () => {
    const { data, error } = await supabase
      .from("swap_points")
      .select("id, name, address");

    if (error) console.error(error);
    else setSwapPoints(data || []);
  };

  // Insertar nuevo evento
  const addEvent = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("No user logged in");

    const { error } = await supabase.from("events").insert([
      {
        user_id: user.id,
        title: newEvent.title,
        date: newEvent.date,
        swap_point_id: newEvent.swap_point_id || null,
        location: "Custom location", // si no usas swap_point
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      setNewEvent({ title: "", date: "", swap_point_id: "" });
      loadEvents(); // recargar todo
    }
  };

  // Cargar todo (plants + events)
  const loadEvents = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [plantEvents, userEvents] = await Promise.all([
      fetchPlantEvents(user.id),
      fetchUserEvents(user.id),
    ]);

    setEvents([...plantEvents, ...userEvents]);
  };

  useEffect(() => {
    loadEvents();
    fetchSwapPoints();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📅 Calendario</h1>

      {/* Formulario para añadir evento */}
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

      {/* Calendario */}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
}
