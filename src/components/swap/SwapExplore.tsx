import { useEffect, useState } from "react";
import SearchBar from "../SearchBar";
import PlantList from "../plants/PlantList";
import { Button } from "../ui/Button";
import type { FullPlant } from "../../services/plantCrudService";

interface Props {
  plants: FullPlant[];
  onProposeSwap: (plant: FullPlant) => void;
}

export default function SwapExplore({ plants, onProposeSwap }: Props) {
  const [filteredPlants, setFilteredPlants] = useState<FullPlant[]>(plants);

  // 🌀 Keep filtered list in sync when plants prop changes
  useEffect(() => {
    setFilteredPlants(plants);
  }, [plants]);

  // 🔍 Handle search with debounce from SearchBar
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPlants(plants);
      return;
    }

    const results = plants.filter((p) =>
      p.nombre_comun?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPlants(results);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Explore available plants
        </h2>
        <Button className="border border-gray-300 bg-gray-100 hover:bg-gray-200">
          Filters
        </Button>
      </div>

      {/* 🔍 Search input */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* 🌿 Reuse PlantList in swap mode */}
      <PlantList
        plants={filteredPlants}
        swapMode
        onProposeSwap={onProposeSwap}
      />
    </div>
  );
}
