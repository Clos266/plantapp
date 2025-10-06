// src/pages/Swap.tsx
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs";
import SwapExplore from "../components/swap/SwapExplore";
import SwapList from "../components/swap/SwapList";
import SwapRequestModal from "../components/swap/SwapRequestModal";
import { useSwaps } from "../hooks/useSwaps";

export default function Swap() {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const session = useSession();
  const userId = session?.user?.id;
  const { swaps, plants, loading, error } = useSwaps();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Cargando intercambios...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        🌿 Intercambios de Plantas
      </h1>

      <Tabs defaultValue={activeTab} onChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="explore">🔍 Buscar swaps</TabsTrigger>
          <TabsTrigger value="my-swaps">🔄 Mis intercambios</TabsTrigger>
        </TabsList>

        <TabsContent value="explore">
          <SwapExplore
            plants={plants}
            onProposeSwap={(plant) => {
              setSelectedPlant(plant);
              setShowModal(true);
            }}
          />
        </TabsContent>

        <TabsContent value="my-swaps">
          <SwapList swaps={swaps} />
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
