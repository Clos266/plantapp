import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../App.css";
import { supabase } from "../services/supabaseClient";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN!;

interface PlantLocation {
  id: string | number;
  plant_name: string;
  user_name: string;
  city: string;
  lat: number;
  lng: number;
}

interface SwapPoint {
  id: string | number;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [center, setCenter] = useState<[number, number]>([2.1734, 41.3851]);
  const [zoom, setZoom] = useState(6);
  const [searchCity, setSearchCity] = useState("");
  const [plants, setPlants] = useState<PlantLocation[]>([]);
  const [swapPoints, setSwapPoints] = useState<SwapPoint[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center,
      zoom,
    });

    mapRef.current.on("move", () => {
      const c = mapRef.current!.getCenter();
      setCenter([c.lng, c.lat]);
      setZoom(mapRef.current!.getZoom());
    });

    return () => mapRef.current?.remove();
  }, []);

  const handleSearch = async () => {
    try {
      const { data: plantsData, error: plantsError } = await supabase
        .from("plants")
        .select("id,nombre_comun,user_id,disponible")
        .eq("disponible", true);

      if (plantsError) throw plantsError;

      const userIds = plantsData.map((p) => p.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id,username,ciudad,lat,lng")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      const normalizedCity = normalizeText(searchCity);

      const combinedPlants: PlantLocation[] = plantsData
        .map((plant) => {
          const user = profilesData.find((u) => u.id === plant.user_id);
          if (!user || !user.lat || !user.lng) return null;
          if (
            normalizedCity &&
            !normalizeText(user.ciudad || "").includes(normalizedCity)
          )
            return null;

          return {
            id: plant.id,
            plant_name: plant.nombre_comun,
            user_name: user.username || "User",
            city: user.ciudad || "",
            lat: Number(user.lat),
            lng: Number(user.lng),
          };
        })
        .filter(Boolean) as PlantLocation[];

      setPlants(combinedPlants);

      const { data: swapData, error: swapError } = await supabase
        .from("swap_points")
        .select("id,name,address,lat,lng");

      if (swapError) throw swapError;

      const filteredSwapPoints = swapData.filter(
        (sp) =>
          !normalizedCity || normalizeText(sp.address).includes(normalizedCity)
      );

      setSwapPoints(filteredSwapPoints);

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      filteredSwapPoints.forEach((sp) => {
        const marker = new mapboxgl.Marker({ color: "blue" })
          .setLngLat([sp.lng, sp.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>${sp.name}</strong><br/>📍 ${sp.address}`
            )
          )
          .addTo(mapRef.current!);
        markersRef.current.push(marker);
      });

      combinedPlants.forEach((loc) => {
        const marker = new mapboxgl.Marker({ color: "green" })
          .setLngLat([loc.lng, loc.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>${loc.plant_name}</strong><br/>👤 ${loc.user_name}<br/>📍 ${loc.city}`
            )
          )
          .addTo(mapRef.current!);
        markersRef.current.push(marker);
      });
    } catch (error) {
      console.error("Error fetching plants, users, or swap points:", error);
    }
  };

  const handleAddSwapPoint = async () => {
    const name = prompt("Swap point name:");
    if (!name) return;
    const address = prompt("Exact address:");
    if (!address) return;

    try {
      const geoRes = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const geoData = await geoRes.json();
      if (!geoData.features || geoData.features.length === 0) {
        alert("Address not found.");
        return;
      }

      const [lng, lat] = geoData.features[0].center;

      const place = geoData.features[0];
      let city = "Unknown";
      if (place.context) {
        const cityFeature = place.context.find(
          (c: any) => c.id.startsWith("place") || c.id.startsWith("locality")
        );
        if (cityFeature) city = cityFeature.text;
      }

      const { error } = await supabase.from("swap_points").insert({
        name,
        address,
        city,
        lat,
        lng,
      });

      if (error) {
        console.error("Error adding swap point:", error);
        alert("Could not add the swap point.");
      } else {
        alert("Swap point added successfully ✅");
        handleSearch();
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto transform transition-transform duration-300 z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6">
          {/* Header con botón toggle en mobile */}
          <div className="flex justify-between items-center mb-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-800">Search Swap</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Find plants and swap locations near you
          </p>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your city"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex flex-col space-y-3 mb-6">
            <button
              onClick={handleSearch}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              Search
            </button>
            <button
              onClick={handleAddSwapPoint}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              + Add Swap Point
            </button>
          </div>

          <hr className="my-6 border-gray-300" />

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nearby Swap Points
            </h3>
            <ul className="space-y-3">
              {swapPoints.map((sp) => (
                <li
                  key={sp.id}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">📍</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{sp.name}</h4>
                      <p className="text-gray-600 text-sm">{sp.address}</p>
                    </div>
                  </div>
                </li>
              ))}
              {swapPoints.length === 0 && (
                <li className="text-gray-500 text-center py-4">
                  No swap points found
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nearby Available Plants
            </h3>
            <ul className="space-y-3">
              {plants.map((loc) => (
                <li
                  key={loc.id}
                  className="bg-green-50 border border-green-200 rounded-lg p-3"
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">🌱</span>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {loc.plant_name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        by {loc.user_name}
                      </p>
                      <p className="text-gray-500 text-sm">📍 {loc.city}</p>
                    </div>
                  </div>
                </li>
              ))}
              {plants.length === 0 && (
                <li className="text-gray-500 text-center py-4">
                  No plants available
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Botón toggle flotante (solo mobile) */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="md:hidden absolute top-4 left-4 z-30 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        {sidebarOpen ? "☰" : "☰"}
      </button>

      {/* Map Container */}
      <div id="map-container" ref={mapContainerRef} className="flex-1" />
    </div>
  );
}
