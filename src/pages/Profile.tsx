import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../contexts/AuthProvider";
import Charts from "./Charts";
import ImageUpload from "../components/ImageUpload";

interface Profile {
  id: string;
  username?: string;
  email?: string;
  cp?: string;
  ciudad?: string;
  lat?: number;
  lng?: number;
  avatar_url?: string; // 👈 añadida para manejar la foto de perfil
}

interface Plant {
  id: number;
  nombre_comun: string;
  disponible: boolean;
  last_watered: string;
  interval_days: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [cp, setCp] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [plants, setPlants] = useState<Plant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // 🔹 Obtener perfil
  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) console.error(error);
    else if (data) {
      setProfile(data);
      setUsername(data.username || "");
      setCp(data.cp || "");
      setCiudad(data.ciudad || "");
    }

    setLoading(false);
  };

  // 🔹 Obtener plantas
  const fetchPlants = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("plants")
      .select("id, nombre_comun, disponible, last_watered, interval_days")
      .eq("user_id", user.id);

    if (error) console.error(error);
    else setPlants(data || []);
  };

  // 🔹 Obtener eventos futuros
  const fetchEvents = async () => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("events")
      .select("id, title, date, location")
      .eq("user_id", user.id)
      .gte("date", today)
      .order("date", { ascending: true });

    if (error) console.error(error);
    else setEvents(data || []);
  };

  // 🔹 Calcular riegos pendientes
  const calculatePendingWaterings = () => {
    const today = new Date();
    return plants.filter((p) => {
      const last = new Date(p.last_watered);
      const next = new Date(last);
      next.setDate(last.getDate() + p.interval_days);
      return next <= today;
    }).length;
  };

  // 🔹 Actualizar perfil
  const updateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        cp,
        ciudad,
      })
      .eq("id", user.id);

    if (error) console.error(error);
    else alert("Perfil actualizado");
  };

  useEffect(() => {
    fetchProfile();
    fetchPlants();
    fetchEvents();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  // stats
  const plantCount = plants.length;
  const availablePlants = plants.filter((p) => p.disponible).length;
  const upcomingEvents = events.length;
  const pendingWaterings = calculatePendingWaterings();

  return (
    <div className="p-4 mt-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <ImageUpload
          folder="profiles" // 👈 bucket de storage
          initialUrl={profile?.avatar_url || ""}
          onUpload={async (newUrl) => {
            if (!user) return;

            const { error } = await supabase
              .from("profiles")
              .update({ avatar_url: newUrl })
              .eq("id", user.id);

            if (error) {
              console.error("Error al guardar avatar:", error);
            } else {
              setProfile({ ...profile!, avatar_url: newUrl });
            }
          }}
        />
      </div>

      {/* Formulario de edición */}
      <div className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="CP"
          value={cp}
          onChange={(e) => setCp(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={updateProfile}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Guardar
        </button>
      </div>

      {/* Charts */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">📊 Mis estadísticas</h2>
        <Charts />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center mb-6">
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-xl font-bold text-green-700">{plantCount}</p>
          <p className="text-sm">Plantas</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-xl font-bold text-blue-700">{upcomingEvents}</p>
          <p className="text-sm">Eventos</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3">
          <p className="text-xl font-bold text-yellow-700">
            {pendingWaterings}
          </p>
          <p className="text-sm">Riegos</p>
        </div>
      </div>

      {/* Lista de plantas */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Mis plantas</h3>
        {plants.length > 0 ? (
          <ul className="space-y-2">
            {plants.map((p) => (
              <li
                key={p.id}
                className="p-3 bg-gray-100 rounded-lg flex justify-between"
              >
                <span>{p.nombre_comun}</span>
                <span
                  className={`text-sm font-semibold ${
                    p.disponible ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {p.disponible ? "Disponible" : "No disponible"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No has registrado ninguna planta aún.
          </p>
        )}
      </div>
    </div>
  );
}
