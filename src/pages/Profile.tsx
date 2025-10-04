import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useProfileData } from "../hooks/useProfileData";
import ImageUpload from "../components/ImageUpload";
import Charts from "./Charts";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    profile,
    plants,
    events,
    loading,
    saveProfile,
    calculatePendingWaterings,
  } = useProfileData(user);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [zipCode, setZipCode] = useState(profile?.cp || "");
  const [city, setCity] = useState(profile?.ciudad || "");

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  const handleSave = async () => {
    await saveProfile({ username, cp: zipCode, ciudad: city });
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handlePhotoChange = async (newUrl: string) => {
    await saveProfile({ avatar_url: newUrl });
    toast.success("Profile photo updated!");
  };

  const pendingWaterings = calculatePendingWaterings();

  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-start
        bg-gray-50 dark:bg-gray-900 py-8
      "
    >
      <Toaster position="top-right" />

      {/* Normal Profile View */}
      {!isEditing && (
        <>
          <div
            className="
              bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md
            "
          >
            <h1 className="text-2xl font-bold mb-4 text-center">My Profile</h1>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-200 shadow-sm">
                <img
                  src={
                    profile.avatar_url ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold">{profile.username || "—"}</p>
              <p className="text-gray-700 dark:text-gray-300">
                {profile.ciudad || "—"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                ZIP: {profile.cp || "—"}
              </p>

              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                className="mt-4"
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Charts */}
          <div
            className="
              bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md mt-8
            "
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              📊 My Statistics
            </h2>
            <Charts />
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-3 text-center w-full max-w-md mt-6">
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3">
              <p className="text-xl font-bold text-green-700 dark:text-green-300">
                {plants.length}
              </p>
              <p className="text-sm">Plants</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3">
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {events.length}
              </p>
              <p className="text-sm">Events</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-3">
              <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                {pendingWaterings}
              </p>
              <p className="text-sm">Waterings</p>
            </div>
          </div>

          {/* Plant preview */}
          <div
            className="
              bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md mt-8
            "
          >
            <h3 className="text-lg font-semibold mb-3 text-center">
              🌿 My Plants
            </h3>

            {plants.length > 0 ? (
              <ul className="space-y-2">
                {plants.slice(0, 3).map((p, index) => (
                  <li
                    key={p.id ?? `plant-${index}`}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-center"
                  >
                    <span>{p.nombre_comun}</span>
                    <span
                      className={`text-sm font-semibold ${
                        p.disponible ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {p.disponible ? "Available" : "Unavailable"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                You haven’t added any plants yet.
              </p>
            )}

            <Button
              onClick={() => navigate("/plants")}
              variant="secondary"
              className="mt-4"
            >
              Manage My Plants
            </Button>
          </div>
        </>
      )}

      {/* Fullscreen Edit Mode ... (sin cambios) */}
      {isEditing && (
        /* ... tu modal de edición ... */
        <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center z-50 overflow-y-auto p-6">
          {/* ... contenido de edición ... */}
        </div>
      )}
    </div>
  );
}
