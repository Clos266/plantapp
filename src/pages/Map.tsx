import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../App.css";
import { supabase } from "../supabaseClient";

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
  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [center, setCenter] = useState<[number, number]>([2.1734, 41.3851]);
  const [zoom, setZoom] = useState(6);
  const [searchCity, setSearchCity] = useState("");
  const [plants, setPlants] = useState<PlantLocation[]>([]);
  const [swapPoints, setSwapPoints] = useState<SwapPoint[]>([]);

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
      // 1️⃣ Get available plants
      const { data: plantsData, error: plantsError } = await supabase
        .from("plants")
        .select("id,nombre_comun,user_id,disponible")
        .eq("disponible", true);

      if (plantsError) throw plantsError;

      // 2️⃣ Get profiles of plant owners
      const userIds = plantsData.map((p) => p.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id,username,ciudad,lat,lng")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      const normalizedCity = normalizeText(searchCity);

      // 3️⃣ Combine plants with their users
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

      // 4️⃣ Get swap points
      const { data: swapData, error: swapError } = await supabase
        .from("swap_points")
        .select("id,name,address,lat,lng");

      if (swapError) throw swapError;

      const filteredSwapPoints = swapData.filter(
        (sp) =>
          !normalizedCity || normalizeText(sp.address).includes(normalizedCity)
      );

      setSwapPoints(filteredSwapPoints);

      // 🔹 Clear previous markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // 🔹 Add swap points (blue)
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

      // 🔹 Add plants (green)
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
      // Geocode with Mapbox
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

      // Extract city from context
      const place = geoData.features[0];
      let city = "Unknown";
      if (place.context) {
        const cityFeature = place.context.find(
          (c: any) => c.id.startsWith("place") || c.id.startsWith("locality")
        );
        if (cityFeature) city = cityFeature.text;
      }

      // Insert into Supabase
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
        handleSearch(); // refresh markers
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="sidebar">
        <h2>Search Swap</h2>
        <input
          type="text"
          placeholder="Enter your city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleAddSwapPoint}>+ Add Swap Point</button>

        <hr />
        <h3>Nearby Swap Points</h3>
        <ul>
          {swapPoints.map((sp) => (
            <li key={sp.id}>
              📍 {sp.name} — {sp.address}
            </li>
          ))}
        </ul>

        <h3>Nearby Available Plants</h3>
        <ul>
          {plants.map((loc) => (
            <li key={loc.id}>
              🌱 {loc.plant_name} — {loc.user_name} ({loc.city})
            </li>
          ))}
        </ul>
      </div>
      <div id="map-container" ref={mapContainerRef} />
    </>
  );
}
