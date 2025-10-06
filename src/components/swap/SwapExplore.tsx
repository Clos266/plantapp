// src/components/swap/SwapExplore.tsx
import { useState } from "react";
import SearchBar from "../SearchBar";
import PlantList from "../plants/PlantList";
import { Button } from "../ui/Button";
import type { FullPlant } from "../../services/plantCrudService";

interface Props {
  plants: FullPlant[];
  onProposeSwap: (plant: FullPlant) => void;
}

export default function SwapExplore({ plants, onProposeSwap }: Props) {
  const [filteredPlants, setFilteredPlants] = useState(plants);

  const handleSearch = (query: string) => {
    if (!query) return setFilteredPlants(plants);
    const results = plants.filter((p) =>
      p.nombre_comun.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPlants(results);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Explora plantas disponibles
        </h2>
        <Button className="border border-gray-300 bg-gray-100 hover:bg-gray-200">
          Filtros
        </Button>
      </div>

      {/* 🔍 Reutilizamos tu SearchBar con debounce */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* 🌿 Reutilizamos PlantList en modo intercambio */}
      <PlantList
        plants={filteredPlants}
        swapMode
        onProposeSwap={onProposeSwap}
      />
    </div>
  );
}
