import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs";
import SwapExplore from "../components/swap/SwapExplore";
import SwapList from "../components/swap/SwapList";
import SwapRequestModal from "../components/swap/SwapRequestModal";

export default function Swap() {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const otherPlants = [
    {
      id: 1,
      nombre_comun: "Aloe Vera",
      categoria: "Suculenta",
      distancia: "2 km",
    },
    {
      id: 2,
      nombre_comun: "Sansevieria",
      categoria: "Interior",
      distancia: "5 km",
    },
    {
      id: 3,
      nombre_comun: "Cactus Echinopsis",
      categoria: "Cactus",
      distancia: "1.5 km",
    },
  ];

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

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        🌿 Intercambios de Plantas
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="explore">🔍 Buscar swaps</TabsTrigger>
          <TabsTrigger value="my-swaps">🔄 Mis intercambios</TabsTrigger>
        </TabsList>

        <TabsContent value="explore">
          <SwapExplore
            plants={otherPlants}
            onProposeSwap={(plant) => {
              setSelectedPlant(plant);
              setShowModal(true);
            }}
          />
        </TabsContent>

        <TabsContent value="my-swaps">
          <SwapList swaps={mySwaps} />
        </TabsContent>
      </Tabs>

      <SwapRequestModal
        open={showModal}
        onClose={() => setShowModal(false)}
        plant={selectedPlant}
      />
    </div>
  );
}
