import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

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
  interval_days?: number; // cada cuántos días regar
  last_watered?: string; // última fecha regada
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

  // Leer plantas
  const fetchPlants = async () => {
    const user = await fetchUser();
    if (!user) return;

    let query = supabase.from("plants").select("*");
    if (showMine) query = query.eq("user_id", user.id);

    const { data, error } = await query;
    if (error) console.error(error);
    else setPlants(data || []);
  };

  // Crear planta
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

  // Borrar planta
  const deletePlant = async (id: number) => {
    const { error } = await supabase.from("plants").delete().eq("id", id);
    if (error) console.error(error);
    else fetchPlants();
  };

  // Editar planta
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

  return (
    <div>
      <h1>Plants</h1>

      <label>
        <input
          type="checkbox"
          checked={showMine}
          onChange={() => setShowMine(!showMine)}
        />{" "}
        Show only my plants
      </label>

      {/* Formulario para nueva planta */}
      <div>
        <h3>Add Plant</h3>
        <input
          type="text"
          placeholder="Nombre común"
          value={newPlant.nombre_comun || ""}
          onChange={(e) =>
            setNewPlant({ ...newPlant, nombre_comun: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Nombre científico"
          value={newPlant.nombre_cientifico || ""}
          onChange={(e) =>
            setNewPlant({ ...newPlant, nombre_cientifico: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Especie"
          value={newPlant.especie || ""}
          onChange={(e) =>
            setNewPlant({ ...newPlant, especie: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Familia"
          value={newPlant.familia || ""}
          onChange={(e) =>
            setNewPlant({ ...newPlant, familia: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Propagación"
          value={newPlant.propagacion || ""}
          onChange={(e) =>
            setNewPlant({ ...newPlant, propagacion: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Clima"
          value={newPlant.clima || ""}
          onChange={(e) => setNewPlant({ ...newPlant, clima: e.target.value })}
        />
        <input
          type="text"
          placeholder="Suelo"
          value={newPlant.suelo || ""}
          onChange={(e) => setNewPlant({ ...newPlant, suelo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Luz"
          value={newPlant.luz || ""}
          onChange={(e) => setNewPlant({ ...newPlant, luz: e.target.value })}
        />
        <input
          type="text"
          placeholder="Agua"
          value={newPlant.agua || ""}
          onChange={(e) => setNewPlant({ ...newPlant, agua: e.target.value })}
        />
        <input
          type="number"
          placeholder="Intervalo de riego (días)"
          value={newPlant.interval_days || 7}
          onChange={(e) =>
            setNewPlant({ ...newPlant, interval_days: Number(e.target.value) })
          }
        />

        <input
          type="date"
          placeholder="Último riego"
          value={
            newPlant.last_watered || new Date().toISOString().split("T")[0]
          }
          onChange={(e) =>
            setNewPlant({ ...newPlant, last_watered: e.target.value })
          }
        />

        <label>
          Disponible:
          <input
            type="checkbox"
            checked={!!newPlant.disponible}
            onChange={(e) =>
              setNewPlant({ ...newPlant, disponible: e.target.checked })
            }
          />
        </label>

        <button onClick={addPlant}>Add Plant</button>
      </div>

      {/* Lista de plantas */}
      <ul>
        {plants.map((plant) => (
          <li key={plant.id}>
            {editingPlant?.id === plant.id ? (
              <div>
                <input
                  type="text"
                  placeholder="Nombre común"
                  value={editingPlant.nombre_comun}
                  onChange={(e) =>
                    setEditingPlant({
                      ...editingPlant,
                      nombre_comun: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Nombre científico"
                  value={editingPlant.nombre_cientifico || ""}
                  onChange={(e) =>
                    setEditingPlant({
                      ...editingPlant,
                      nombre_cientifico: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Especie"
                  value={editingPlant.especie || ""}
                  onChange={(e) =>
                    setEditingPlant({
                      ...editingPlant,
                      especie: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Familia"
                  value={editingPlant.familia || ""}
                  onChange={(e) =>
                    setEditingPlant({
                      ...editingPlant,
                      familia: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Propagación"
                  value={editingPlant.propagacion || ""}
                  onChange={(e) =>
                    setEditingPlant({
                      ...editingPlant,
                      propagacion: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Clima"
                  value={editingPlant.clima || ""}
                  onChange={(e) =>
                    setEditingPlant({ ...editingPlant, clima: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Suelo"
                  value={editingPlant.suelo || ""}
                  onChange={(e) =>
                    setEditingPlant({ ...editingPlant, suelo: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Luz"
                  value={editingPlant.luz || ""}
                  onChange={(e) =>
                    setEditingPlant({ ...editingPlant, luz: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Agua"
                  value={editingPlant.agua || ""}
                  onChange={(e) =>
                    setEditingPlant({ ...editingPlant, agua: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Intervalo de riego (días)"
                  value={editingPlant.interval_days || ""}
                  onChange={(e) =>
                    setEditingPlant({
                      ...editingPlant,
                      interval_days: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  placeholder="Último riego"
                  value={editingPlant.last_watered || ""}
                  onChange={(e) =>
                    setEditingPlant({
                      ...editingPlant,
                      last_watered: e.target.value,
                    })
                  }
                />
                <label>
                  Disponible:
                  <input
                    type="checkbox"
                    checked={!!editingPlant.disponible}
                    onChange={(e) =>
                      setEditingPlant({
                        ...editingPlant,
                        disponible: e.target.checked,
                      })
                    }
                  />
                </label>
                <button onClick={updatePlant}>Save</button>
                <button onClick={() => setEditingPlant(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <b>{plant.nombre_comun}</b> ({plant.nombre_cientifico || "?"}){" "}
                {plant.disponible ? "(Disponible)" : "(No disponible)"}
                <button onClick={() => setEditingPlant(plant)}>Edit</button>
                <button onClick={() => deletePlant(plant.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
