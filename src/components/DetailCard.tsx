interface DetailCardProps {
  item: {
    id: number | string;
    title: string;
    subtitle?: string;
    image: string;
    description?: string;
    date?: string;
    location?: string;
    type?: "plant" | "event" | "user" | "news";
  };
  onClose: () => void;
}

export default function DetailCard({ item, onClose }: DetailCardProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 shadow-xl relative">
        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Imagen */}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {item.title}
        </h2>

        {/* Subtítulo */}
        {item.subtitle && (
          <p className="text-gray-500 dark:text-gray-300 mb-2">
            {item.subtitle}
          </p>
        )}

        {/* Descripción */}
        {item.description && (
          <p className="text-gray-700 dark:text-gray-200 mb-2">
            {item.description}
          </p>
        )}

        {/* Información adicional según tipo */}
        {item.type === "event" && item.date && (
          <p className="text-sm text-blue-600 dark:text-blue-400">
            📅 {item.date} {item.location ? `- 📍 ${item.location}` : ""}
          </p>
        )}

        {item.type === "user" && (
          <p className="text-sm text-green-600 dark:text-green-400">
            👤 Usuario
          </p>
        )}

        {item.type === "plant" && (
          <p className="text-sm text-green-700 dark:text-green-300">
            🌱 Planta
          </p>
        )}

        {item.type === "news" && (
          <p className="text-sm text-yellow-600 dark:text-yellow-300">
            📰 Noticia
          </p>
        )}
      </div>
    </div>
  );
}
