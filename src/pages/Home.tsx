import { useState } from "react";
import { supabase } from "../supabaseClient";
import SearchBar from "../components/SearchBar";

interface Item {
  id: number | string;
  title: string;
  subtitle: string;
  image: string;
}

interface SliderProps {
  title: string;
  items: Item[];
  cardHeight?: string;
}

function HorizontalSlider({ title, items, cardHeight = "48" }: SliderProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 px-2">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 px-2 no-scrollbar">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className={`flex-shrink-0 w-64 md:w-72 h-${cardHeight} bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-2/3 object-cover"
              />
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 px-2">No hay resultados</p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [plantResults, setPlantResults] = useState<Item[]>([]);
  const [eventResults, setEventResults] = useState<Item[]>([]);
  const [userResults, setUserResults] = useState<Item[]>([]);

  const noticias: Item[] = [
    {
      id: 1,
      title: "Nueva especie de cactus",
      subtitle: "Descubierta recientemente",
      image:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ_RNp_eL_avijFSWfsohyfbEYpL1PwXR99Dq0-ja-_sPkZRZvQscwkiTF6ZJsK4TGXxA1DrpJIsM5xZi25NcsJCONhBwj4zjPJAShVbw",
    },
    {
      id: 2,
      title: "Consejos de riego",
      subtitle: "En otoño tus plantas",
      image:
        "https://tirolinavalledetena.com/wp-content/uploads/2024/09/tirolina-llegada-del-otono-en-el-pirineo.webp",
    },
    {
      id: 3,
      title: "Intercambio de plantas",
      subtitle: "Evento en Barcelona",
      image:
        "https://media.istockphoto.com/id/1209840671/es/foto/primer-plano-de-la-ama-de-casa-divertida-asomarse-desde-el-arbusto-de-la-planta-verde-y.jpg?s=2048x2048&w=is&k=20&c=uNTADyOVYPTtqExj29WSRTdbt78IcH5cAnOj6rBJrAU=",
    },
  ];

  const eventos: Item[] = [
    {
      id: 1,
      title: "Swap en Parque Central",
      subtitle: "01 Oct 2025",
      image:
        "https://www.visitvalencia.com/sites/default/files/styles/content_gallery_xl/public/media/media-images/images/c/central-park-vv-17072_1024-_foto_pablo_casino.webp?itok=J4awntUe",
    },
    {
      id: 2,
      title: "Taller de suculentas",
      subtitle: "05 Oct 2025",
      image:
        "https://static.bainet.es/clip/6b1dc5c7-2ce1-4805-95d4-88144a5b5c8e_16-9-aspect-ratio_1600w_0.webp",
    },
    {
      id: 3,
      title: "Charla de plantas medicinales",
      subtitle: "10 Oct 2025",
      image:
        "https://static.bainet.es/clip/6b1dc5c7-2ce1-4805-95d4-88144a5b5c8e_16-9-aspect-ratio_1600w_0.webp",
    },
  ];

  const ultimasPlantas: Item[] = [
    {
      id: 1,
      title: "Aloe Vera",
      subtitle: "Juan",
      image: "https://spacegarden.es/289-large_default/aloe-vera.jpg",
    },
    {
      id: 2,
      title: "Cactus Espiral",
      subtitle: "María",
      image: "https://m.media-amazon.com/images/I/41MmEmYD8cL._AC_SL1000_.jpg",
    },
    {
      id: 3,
      title: "Ficus Lyrata",
      subtitle: "Pedro",
      image:
        "https://florastore.com/cdn/shop/files/3313211_Productimage_02_SQ_93369905-2733-4d64-888d-d7ae681252cd.jpg?v=1758705122&width=1800",
    },
  ];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setPlantResults([]);
      setEventResults([]);
      setUserResults([]);
      return;
    }

    // 🔹 Buscar plantas
    const { data: plants, error: plantErr } = await supabase
      .from("plants")
      .select("id, nombre_comun, user_id")
      .ilike("nombre_comun", `%${query}%`);
    if (plantErr) console.error(plantErr);

    setPlantResults(
      (plants || []).map((p) => ({
        id: p.id,
        title: p.nombre_comun,
        subtitle: p.user_id,
        image: "https://via.placeholder.com/300x200?text=Planta",
      }))
    );

    // 🔹 Buscar eventos
    const { data: events, error: eventErr } = await supabase
      .from("events")
      .select("id, title, date, location")
      .ilike("title", `%${query}%`);
    if (eventErr) console.error(eventErr);

    setEventResults(
      (events || []).map((e) => ({
        id: e.id,
        title: e.title,
        subtitle: `${e.date} - ${e.location}`,
        image: "https://via.placeholder.com/300x200?text=Evento",
      }))
    );

    // 🔹 Buscar usuarios
    const { data: users, error: userErr } = await supabase
      .from("profiles")
      .select("id, username, ciudad")
      .ilike("username", `%${query}%`);
    if (userErr) console.error(userErr);

    setUserResults(
      (users || []).map((u) => ({
        id: u.id,
        title: u.username || "Sin nombre",
        subtitle: u.ciudad || "",
        image: "https://via.placeholder.com/300x200?text=Usuario",
      }))
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Barra de búsqueda */}
      <div className="flex-none p-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Sliders horizontales */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden px-2 md:px-4">
        {searchQuery ? (
          <>
            <HorizontalSlider
              title="🌱 Plantas"
              items={plantResults}
              cardHeight="48"
            />
            <HorizontalSlider
              title="📅 Eventos"
              items={eventResults}
              cardHeight="48"
            />
            <HorizontalSlider
              title="👤 Usuarios"
              items={userResults}
              cardHeight="48"
            />
          </>
        ) : (
          <>
            <HorizontalSlider
              title="Noticias"
              items={noticias}
              cardHeight="22"
            />
            <HorizontalSlider
              title="Próximos eventos"
              items={eventos}
              cardHeight="48"
            />
            <HorizontalSlider
              title="Últimas plantas añadidas"
              items={ultimasPlantas}
              cardHeight="48"
            />
          </>
        )}
      </div>
    </div>
  );
}
