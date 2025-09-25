import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { supabase } from "../supabaseClient";
import { addDays, startOfWeek, format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
);

interface Plant {
  id: number;
  nombre_comun: string;
  familia?: string;
  disponible?: boolean;
  last_watered?: string;
  interval_days?: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
}

export default function Charts() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Plants
    const { data: plantData, error: plantError } = await supabase
      .from("plants")
      .select("*")
      .eq("user_id", user.id);
    if (plantError) console.error(plantError);
    else setPlants(plantData || []);

    // Events
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", user.id);
    if (eventError) console.error(eventError);
    else setEvents(eventData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Plants by family ---
  const familyCounts: Record<string, number> = {};
  plants.forEach((p) => {
    const f = p.familia || "Sin familia";
    familyCounts[f] = (familyCounts[f] || 0) + 1;
  });
  const familyLabels = Object.keys(familyCounts);
  const familyData = Object.values(familyCounts);

  // --- Plants available vs not ---
  const availableCount = plants.filter((p) => p.disponible).length;
  const unavailableCount = plants.length - availableCount;

  // --- Riegos por semana ---
  const today = new Date();
  const weekStarts: string[] = [];
  const weekCounts: number[] = [];
  for (let i = 0; i < 8; i++) {
    const weekStart = addDays(startOfWeek(today), i * 7);
    const weekLabel = format(weekStart, "yyyy-MM-dd");
    weekStarts.push(weekLabel);
    const count = plants.filter((p) => {
      const last = p.last_watered ? new Date(p.last_watered) : today;
      const next = addDays(last, p.interval_days || 7);
      return next >= weekStart && next < addDays(weekStart, 7);
    }).length;
    weekCounts.push(count);
  }

  // --- Eventos por mes ---
  const months: Record<string, number> = {};
  events.forEach((ev) => {
    const month = format(new Date(ev.date), "yyyy-MM");
    months[month] = (months[month] || 0) + 1;
  });
  const monthLabels = Object.keys(months).sort();
  const monthData = monthLabels.map((m) => months[m]);

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-xl font-bold mb-4">📊 Estadísticas de Plant Swap</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plants by family */}
        <div>
          <h2 className="font-semibold mb-2">Plantas por familia</h2>
          <Doughnut
            data={{
              labels: familyLabels,
              datasets: [
                {
                  label: "# plantas",
                  data: familyData,
                  backgroundColor: familyLabels.map(
                    (_, i) =>
                      `hsl(${(i * 360) / familyLabels.length}, 70%, 50%)`
                  ),
                },
              ],
            }}
          />
        </div>

        {/* Plants available */}
        <div>
          <h2 className="font-semibold mb-2">Disponibilidad de plantas</h2>
          <Pie
            data={{
              labels: ["Disponibles", "No disponibles"],
              datasets: [
                {
                  label: "# plantas",
                  data: [availableCount, unavailableCount],
                  backgroundColor: ["#4ade80", "#f87171"],
                },
              ],
            }}
          />
        </div>

        {/* Riegos por semana */}
        <div>
          <h2 className="font-semibold mb-2">Riegos próximos por semana</h2>
          <Bar
            data={{
              labels: weekStarts,
              datasets: [
                {
                  label: "# riegos",
                  data: weekCounts,
                  backgroundColor: "#3b82f6",
                },
              ],
            }}
          />
        </div>

        {/* Eventos por mes */}
        <div>
          <h2 className="font-semibold mb-2">Eventos de intercambio por mes</h2>
          <Line
            data={{
              labels: monthLabels,
              datasets: [
                {
                  label: "# eventos",
                  data: monthData,
                  borderColor: "#fbbf24",
                  backgroundColor: "rgba(251,191,36,0.3)",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
