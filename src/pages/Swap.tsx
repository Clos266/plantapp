import { useState } from "react";
import React from "react";

// 🔹 Mini-implementación de Tabs
function Tabs({ value, onValueChange, children }: any) {
  // Clonamos children para pasarles las props necesarias
  return (
    <div>
      {children.map((child: any) =>
        child.type.displayName === "TabsList"
          ? React.cloneElement(child, { value, onValueChange })
          : child
      )}
    </div>
  );
}

function TabsList({ children, value, onValueChange }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-2 flex gap-2">
      {children.map((child: any) =>
        React.cloneElement(child, { activeValue: value, onValueChange })
      )}
    </div>
  );
}
TabsList.displayName = "TabsList";

function TabsTrigger({ value, activeValue, onValueChange, children }: any) {
  const active = value === activeValue;
  return (
    <button
      onClick={() => onValueChange(value)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-green-500 text-white"
          : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
TabsTrigger.displayName = "TabsTrigger";

function TabsContent({ value, activeValue, children }: any) {
  if (value !== activeValue) return null;
  return <div className="mt-6">{children}</div>;
}
TabsContent.displayName = "TabsContent";

// 🔹 Mini componentes UI de apoyo
function Button({ children, className = "", ...props }: any) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function Input({ className = "", ...props }: any) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${className}`}
    />
  );
}

// 🔹 Modal simple (Dialog)
function Dialog({ open, onClose, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 relative shadow-lg">
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
      </div>
    </div>
  );
}

// 🔹 Página principal de Swaps
export default function Swap() {
  const [activeTab, setActiveTab] = useState("explore");
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<any>(null);

  // Plantas simuladas
  const otherPlants = [
    { id: 1, nombre: "Aloe Vera", categoria: "Suculenta", distancia: "2 km" },
    { id: 2, nombre: "Sansevieria", categoria: "Interior", distancia: "5 km" },
    {
      id: 3,
      nombre: "Cactus Echinopsis",
      categoria: "Cactus",
      distancia: "1.5 km",
    },
  ];

  // Intercambios simulados
  const mySwaps = [
    {
      id: 1,
      tipo: "enviado",
      planta_mia: "Poto",
      planta_otro: "Cactus Echinopsis",
      estado: "pendiente",
    },
    {
      id: 2,
      tipo: "recibido",
      planta_mia: "Aloe Vera",
      planta_otro: "Suculenta Jade",
      estado: "aceptado",
    },
  ];

  const filteredPlants = otherPlants.filter((p) =>
    p.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        🌿 Intercambios de Plantas
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger
            value="explore"
            activeValue={activeTab}
            onValueChange={setActiveTab}
          >
            🔍 Buscar swaps
          </TabsTrigger>
          <TabsTrigger
            value="my-swaps"
            activeValue={activeTab}
            onValueChange={setActiveTab}
          >
            🔄 Mis intercambios
          </TabsTrigger>
        </TabsList>

        {/* Buscar swaps */}
        <TabsContent value="explore" activeValue={activeTab}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-3">
              Explora plantas disponibles
            </h2>

            {/* Buscador */}
            <div className="mb-4 flex gap-3">
              <Input
                placeholder="Buscar por nombre..."
                value={query}
                onChange={(e: any) => setQuery(e.target.value)}
              />
              <Button className="border border-gray-300 bg-gray-100 hover:bg-gray-200">
                Filtros
              </Button>
            </div>

            {/* Lista de plantas */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlants.length > 0 ? (
                filteredPlants.map((plant) => (
                  <div
                    key={plant.id}
                    className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {plant.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">{plant.categoria}</p>
                      <p className="text-xs text-gray-400">
                        {plant.distancia} de ti
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedPlant(plant);
                        setShowModal(true);
                      }}
                      className="mt-3 bg-green-500 hover:bg-green-600 text-white"
                    >
                      Proponer intercambio
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No se encontraron plantas.</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Mis intercambios */}
        <TabsContent value="my-swaps" activeValue={activeTab}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-3">Tus intercambios</h2>
            {mySwaps.length > 0 ? (
              <div className="space-y-3">
                {mySwaps.map((swap) => (
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
                      className={`px-3 py-1 text-xs rounded-full ${
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
            ) : (
              <p className="text-gray-500">No tienes intercambios todavía.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de solicitud */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-lg font-semibold mb-3">
          Proponer intercambio con {selectedPlant?.nombre}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tu planta</label>
            <select className="w-full mt-1 p-2 border rounded-lg">
              <option>Poto</option>
              <option>Monstera</option>
              <option>Jade</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Punto de intercambio</label>
            <select className="w-full mt-1 p-2 border rounded-lg">
              <option>Parque Central</option>
              <option>Mercado Verde</option>
              <option>Mi casa (2 km)</option>
            </select>
          </div>
          <Button
            onClick={() => {
              setShowModal(false);
              alert("Solicitud enviada ✉️");
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Enviar solicitud
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
