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
import { supabase } from "../services/supabaseClient";
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

    const { data: plantData, error: plantError } = await supabase
      .from("plants")
      .select("*")
      .eq("user_id", user.id);
    if (plantError) console.error(plantError);
    else setPlants(plantData || []);

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
    weekStarts.push(format(weekStart, "yyyy-MM-dd"));
    const count = plants.filter((p) => {
      const last = p.last_watered ? new Date(p.last_watered) : today;
      const next = addDays(last, p.interval_days || 7);
      return next >= weekStart && next < addDays(weekStart, 7);
    }).length;
    weekCounts.push(count);
  }

  // --- Actividad del usuario últimos 12 meses ---
  const activity: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const m = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthLabel = format(m, "yyyy-MM");
    activity[monthLabel] = 0;
  }

  plants.forEach((p) => {
    if (p.last_watered) {
      const month = format(new Date(p.last_watered), "yyyy-MM");
      if (activity[month] !== undefined) activity[month] += 1;
    }
  });

  events.forEach((ev) => {
    const month = format(new Date(ev.date), "yyyy-MM");
    if (activity[month] !== undefined) activity[month] += 1;
  });

  const activityLabels = Object.keys(activity);
  const activityData = Object.values(activity);

  const chartContainer =
    "bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md flex flex-col overflow-hidden min-h-[250px] md:h-64 w-full";

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold mb-4">📊 Estadísticas de Plant Swap</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={chartContainer}>
          <h2 className="font-semibold mb-2 text-sm">Plantas por familia</h2>
          <div className="flex-1">
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
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className={chartContainer}>
          <h2 className="font-semibold mb-2 text-sm">
            Disponibilidad de plantas
          </h2>
          <div className="flex-1">
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
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className={chartContainer}>
          <h2 className="font-semibold mb-2 text-sm">
            Riegos próximos por semana
          </h2>
          <div className="flex-1">
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
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className={chartContainer}>
          <h2 className="font-semibold mb-2 text-sm">
            Actividad del usuario (últimos 12 meses)
          </h2>
          <div className="flex-1">
            <Line
              data={{
                labels: activityLabels,
                datasets: [
                  {
                    label: "# cambios / riegos",
                    data: activityData,
                    borderColor: "#fbbf24",
                    backgroundColor: "rgba(251,191,36,0.3)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
