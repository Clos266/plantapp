import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthProvider";

interface Profile {
  id: string;
  username?: string;
  email?: string;
  cp?: string;
  ciudad?: string;
  lat?: number;
  lng?: number;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [cp, setCp] = useState("");
  const [ciudad, setCiudad] = useState("");

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN!;

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

  // 🔹 Obtener lat/lng de Mapbox usando ciudad o CP
  const fetchLatLng = async (query: string) => {
    if (!query) return null;
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=ES`
    );
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
    return null;
  };

  // 🔹 Actualizar perfil
  const updateProfile = async () => {
    if (!user) return;

    // Obtener lat/lng según CP o ciudad
    const location =
      (await fetchLatLng(cp)) || (await fetchLatLng(ciudad)) || null;

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        cp,
        ciudad,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
      })
      .eq("id", user.id);

    if (error) console.error(error);
    else alert("Perfil actualizado");
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div>
      <h1>Mi Perfil</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="CP"
        value={cp}
        onChange={(e) => setCp(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ciudad"
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
      />
      <button onClick={updateProfile}>Guardar</button>
    </div>
  );
}
