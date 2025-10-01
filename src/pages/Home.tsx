import { useState } from "react";
import { supabase } from "../supabaseClient";
import SearchBar from "../components/SearchBar";
import HorizontalSlider from "../components/HorizontalSlider";
import DetailCard from "../components/DetailCard";

interface Item {
  id: number | string;
  title: string;
  subtitle?: string;
  image: string;
  type?: "plant" | "event" | "user" | "news";
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Sliders fijos
  const noticias: Item[] = [
    {
      id: 1,
      title: "Nueva especie de cactus",
      subtitle: "Descubierta recientemente",
      image:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ_RNp_eL_avijFSWfsohyfbEYpL1PwXR99Dq0-ja-_sPkZRZvQscwkiTF6ZJsK4TGXxA1DrpJIsM5xZi25NcsJCONhBwj4zjPJAShVbw",
      type: "news",
    },
    {
      id: 2,
      title: "Consejos de riego",
      subtitle: "En otoño tus plantas",
      image:
        "https://tirolinavalledetena.com/wp-content/uploads/2024/09/tirolina-llegada-del-otono-en-el-pirineo.webp",
      type: "news",
    },
    {
      id: 3,
      title: "Intercambio de plantas",
      subtitle: "Evento en Barcelona",
      image:
        "https://media.istockphoto.com/id/1209840671/es/foto/primer-plano-de-la-ama-de-casa-divertida-asomarse-desde-el-arbusto-de-la-planta-verde-y.jpg?s=2048x2048&w=is&k=20&c=uNTADyOVYPTtqExj29WSRTdbt78IcH5cAnOj6rBJrAU=",
      type: "news",
    },
  ];

  const eventos: Item[] = [
    {
      id: 1,
      title: "Swap en Parque Central",
      subtitle: "01 Oct 2025",
      image:
        "https://www.visitvalencia.com/sites/default/files/styles/content_gallery_xl/public/media/media-images/images/c/central-park-vv-17072_1024-_foto_pablo_casino.webp?itok=J4awntUe",
      type: "event",
    },
    {
      id: 2,
      title: "Taller de suculentas",
      subtitle: "05 Oct 2025",
      image:
        "https://static.bainet.es/clip/6b1dc5c7-2ce1-4805-95d4-88144a5b5c8e_16-9-aspect-ratio_1600w_0.webp",
      type: "event",
    },
    {
      id: 3,
      title: "Charla de plantas medicinales",
      subtitle: "10 Oct 2025",
      image:
        "https://static.bainet.es/clip/6b1dc5c7-2ce1-4805-95d4-88144a5b5c8e_16-9-aspect-ratio_1600w_0.webp",
      type: "event",
    },
  ];

  const ultimasPlantas: Item[] = [
    {
      id: 1,
      title: "Aloe Vera",
      subtitle: "Juan",
      image: "https://spacegarden.es/289-large_default/aloe-vera.jpg",
      type: "plant",
    },
    {
      id: 2,
      title: "Cactus Espiral",
      subtitle: "María",
      image: "https://m.media-amazon.com/images/I/41MmEmYD8cL._AC_SL1000_.jpg",
      type: "plant",
    },
    {
      id: 3,
      title: "Ficus Lyrata",
      subtitle: "Pedro",
      image:
        "https://florastore.com/cdn/shop/files/3313211_Productimage_02_SQ_93369905-2733-4d64-888d-d7ae681252cd.jpg?v=1758705122&width=1800",
      type: "plant",
    },
  ];

  // Función de búsqueda combinada
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    let results: Item[] = [];

    // Plantas
    const { data: plants, error: plantErr } = await supabase
      .from("plants")
      .select("id, nombre_comun, user_id, image_url")
      .ilike("nombre_comun", `%${query}%`);
    if (plantErr) console.error(plantErr);

    results = [
      ...results,
      ...(plants || []).map((p) => ({
        id: p.id,
        title: p.nombre_comun,
        subtitle: `Propietario: ${p.user_id}`,
        image: p.image_url || "https://via.placeholder.com/300x200?text=Planta",
        type: "plant",
      })),
    ];

    // Eventos
    const { data: events, error: eventErr } = await supabase
      .from("events")
      .select("id, title, date, location, image_url")
      .ilike("title", `%${query}%`);
    if (eventErr) console.error(eventErr);

    results = [
      ...results,
      ...(events || []).map((e) => ({
        id: e.id,
        title: e.title,
        subtitle: `${e.date} - ${e.location}`,
        image: e.image_url || "https://via.placeholder.com/300x200?text=Evento",
        type: "event",
      })),
    ];

    // Usuarios
    const { data: users, error: userErr } = await supabase
      .from("profiles")
      .select("id, username, ciudad, avatar_url")
      .ilike("username", `%${query}%`);
    if (userErr) console.error(userErr);

    results = [
      ...results,
      ...(users || []).map((u) => ({
        id: u.id,
        title: u.username || "Sin nombre",
        subtitle: u.ciudad || "",
        image:
          u.avatar_url || "https://via.placeholder.com/300x200?text=Usuario",
        type: "user",
      })),
    ];

    setSearchResults(results);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* SearchBar */}
      <div className="flex-none p-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Contenido */}
      <div className="flex-1 flex mb-10 flex-col gap-6 overflow-auto px-2 md:px-4">
        {searchQuery ? (
          <div className="flex flex-col gap-4">
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-gray-500 dark:text-gray-300 text-sm">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No se encontraron resultados</p>
            )}
          </div>
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

      {/* DetailCard */}
      {selectedItem && (
        <DetailCard item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
