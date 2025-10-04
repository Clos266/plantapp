import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import ImageUpload from "../components/ImageUpload";

interface Plant {
  id: number;
  user_id: string;
  created_at?: string;
  nombre_comun: string;
  nombre_cientifico?: string;
  especie?: string;
  familia?: string;
  propagacion?: string;
  clima?: string;
  suelo?: string;
  luz?: string;
  agua?: string;
  disponible?: boolean;
  interval_days?: number;
  last_watered?: string;
  image_url?: string;
}

export default function Plants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [newPlant, setNewPlant] = useState<Partial<Plant>>({
    nombre_comun: "",
    disponible: true,
  });
  const [showMine, setShowMine] = useState(true);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  };

  const fetchPlants = async () => {
    const user = await fetchUser();
    if (!user) return;

    let query = supabase.from("plants").select("*");
    if (showMine) query = query.eq("user_id", user.id);

    const { data, error } = await query;
    if (error) console.error(error);
    else setPlants(data || []);
  };

  const addPlant = async () => {
    const user = await fetchUser();
    if (!user) return alert("No user logged in");

    const { error } = await supabase.from("plants").insert([
      {
        user_id: user.id,
        ...newPlant,
      },
    ]);
    if (error) console.error(error);
    else {
      setNewPlant({ nombre_comun: "", disponible: true });
      fetchPlants();
    }
  };

  const deletePlant = async (id: number) => {
    const { error } = await supabase.from("plants").delete().eq("id", id);
    if (error) console.error(error);
    else fetchPlants();
  };

  const updatePlant = async () => {
    if (!editingPlant) return;
    const { error } = await supabase
      .from("plants")
      .update(editingPlant)
      .eq("id", editingPlant.id);

    if (error) console.error(error);
    else {
      setEditingPlant(null);
      fetchPlants();
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [showMine]);

  const plantInputs = [
    { label: "Nombre común", key: "nombre_comun", type: "text" },
    { label: "Nombre científico", key: "nombre_cientifico", type: "text" },
    { label: "Especie", key: "especie", type: "text" },
    { label: "Familia", key: "familia", type: "text" },
    { label: "Propagación", key: "propagacion", type: "text" },
    { label: "Clima", key: "clima", type: "text" },
    { label: "Suelo", key: "suelo", type: "text" },
    { label: "Luz", key: "luz", type: "text" },
    { label: "Agua", key: "agua", type: "text" },
    {
      label: "Intervalo de riego (días)",
      key: "interval_days",
      type: "number",
    },
    { label: "Último riego", key: "last_watered", type: "date" },
  ];

  const renderInputs = (plant: Partial<Plant>, setPlant: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {plantInputs.map(({ label, key, type }) => (
        <input
          key={key}
          type={type}
          placeholder={label}
          value={
            typeof plant[key as keyof Plant] === "boolean"
              ? ""
              : plant[key as keyof Plant] !== undefined
              ? (plant[key as keyof Plant] as string | number)
              : ""
          }
          onChange={(e) => {
            const value =
              type === "number" ? Number(e.target.value) : e.target.value;
            setPlant({ ...plant, [key]: value });
          }}
          className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
        />
      ))}
      <label className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={!!plant.disponible}
          onChange={(e) => setPlant({ ...plant, disponible: e.target.checked })}
          className="form-checkbox"
        />
        Disponible
      </label>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        🌱 Plants
      </h1>

      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={showMine}
          onChange={() => setShowMine(!showMine)}
          className="form-checkbox"
        />
        Show only my plants
      </label>

      {/* Formulario nueva planta */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-2">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          Add Plant
        </h3>
        {renderInputs(newPlant, setNewPlant)}

        {/* Componente de subida de imagen */}
        <ImageUpload
          folder="plants"
          initialUrl={newPlant.image_url}
          onUpload={(url) => setNewPlant({ ...newPlant, image_url: url })}
        />

        <button
          onClick={addPlant}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2"
        >
          Add Plant
        </button>
      </div>

      {/* Lista de plantas */}
      <ul className="space-y-2">
        {plants.map((plant) => (
          <li
            key={plant.id}
            className="bg-white dark:bg-gray-800 p-3 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0"
          >
            {editingPlant?.id === plant.id ? (
              <div className="w-full space-y-2">
                {renderInputs(editingPlant, setEditingPlant)}

                {/* Subida de imagen en edición */}
                <ImageUpload
                  folder="plants"
                  initialUrl={editingPlant.image_url}
                  onUpload={(url) =>
                    setEditingPlant(
                      editingPlant ? { ...editingPlant, image_url: url } : null
                    )
                  }
                />

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={updatePlant}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPlant(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Imagen de planta */}
                  {plant.image_url && (
                    <img
                      src={plant.image_url}
                      alt={plant.nombre_comun}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex flex-col">
                    <span className="font-semibold">{plant.nombre_comun}</span>
                    <span className="text-gray-500 dark:text-gray-300">
                      {plant.nombre_cientifico || "?"}
                    </span>
                    {plant.especie && (
                      <span className="text-gray-500 dark:text-gray-300">
                        {plant.especie}
                      </span>
                    )}
                    {plant.familia && (
                      <span className="text-gray-500 dark:text-gray-300">
                        {plant.familia}
                      </span>
                    )}
                    {plant.propagacion && (
                      <span className="text-gray-500 dark:text-gray-300">
                        {plant.propagacion}
                      </span>
                    )}
                    {plant.clima && (
                      <span className="text-gray-500 dark:text-gray-300">
                        {plant.clima}
                      </span>
                    )}
                    {plant.suelo && (
                      <span className="text-gray-500 dark:text-gray-300">
                        {plant.suelo}
                      </span>
                    )}
                    {plant.luz && (
                      <span className="text-gray-500 dark:text-gray-300">
                        {plant.luz}
                      </span>
                    )}
                    {plant.agua && (
                      <span className="text-gray-500 dark:text-gray-300">
                        {plant.agua}
                      </span>
                    )}
                    <span
                      className={
                        plant.disponible ? "text-green-500" : "text-red-500"
                      }
                    >
                      {plant.disponible ? "Disponible" : "No disponible"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPlant(plant)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePlant(plant.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
