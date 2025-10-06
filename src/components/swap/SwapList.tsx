// src/components/swap/SwapList.tsx

interface Swap {
  id: number;
  tipo: "enviado" | "recibido";
  planta_mia: string;
  planta_otro: string;
  estado: "pendiente" | "aceptado" | "rechazado";
}

interface Props {
  swaps: Swap[];
}

export default function SwapList({ swaps }: Props) {
  if (!swaps.length)
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">
        No tienes intercambios todavía.
      </p>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
        Tus intercambios
      </h2>

      <div className="space-y-3">
        {swaps.map((swap) => (
          <div
            key={swap.id}
            className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            <div>
              <p className="font-medium">
                {swap.tipo === "enviado" ? "📤 Enviado" : "📥 Recibido"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {swap.planta_mia} ↔ {swap.planta_otro}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs rounded-full capitalize ${
                swap.estado === "pendiente"
                  ? "bg-yellow-200 text-yellow-800"
                  : swap.estado === "aceptado"
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {swap.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
