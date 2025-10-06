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
import toast from "react-hot-toast";

export default function Swap() {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const session = useSession();
  const userId = session?.user?.id;

  const {
    swaps,
    plants,
    loading,
    error,
    createSwap,
    acceptSwap,
    rejectSwap,
    completeSwap,
  } = useSwaps();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading swaps...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );

  // ✅ Wrapper functions with toast notifications
  const handleAccept = async (id: number) => {
    try {
      await acceptSwap(id);
      toast.success("Swap accepted! 🎉");
    } catch (err: any) {
      toast.error("Failed to accept swap ❌");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectSwap(id);
      toast("Swap rejected 🚫", { icon: "❌" });
    } catch (err: any) {
      toast.error("Failed to reject swap ❌");
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await completeSwap(id);
      toast.success("Swap marked as completed ✅");
    } catch (err: any) {
      toast.error("Failed to complete swap ❌");
    }
  };

  const handleCreateSwap = async (swapData: any) => {
    try {
      await createSwap(swapData);
      setShowModal(false);
      toast.success("Swap request sent ✉️");
    } catch (err: any) {
      toast.error("Failed to create swap ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        🌿 Plant Swaps
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="explore">🔍 Explore swaps</TabsTrigger>
          <TabsTrigger value="my-swaps">🔄 My swaps</TabsTrigger>
        </TabsList>

        {/* 🔍 Explore swaps tab */}
        <TabsContent value="explore">
          <SwapExplore
            plants={plants}
            onProposeSwap={(plant) => {
              setSelectedPlant(plant);
              setShowModal(true);
            }}
          />
        </TabsContent>

        {/* 🔄 My swaps tab */}
        <TabsContent value="my-swaps">
          <SwapList
            swaps={swaps}
            onAccept={handleAccept}
            onReject={handleReject}
            onComplete={handleComplete}
            userId={userId}
          />
        </TabsContent>
      </Tabs>

      {/* 💬 Swap request modal */}
      <SwapRequestModal
        open={showModal}
        onClose={() => setShowModal(false)}
        plant={selectedPlant}
        onSubmit={handleCreateSwap}
      />
    </div>
  );
}
