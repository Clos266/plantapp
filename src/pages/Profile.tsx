import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useProfileData } from "../hooks/useProfileData";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileEditCard from "../components/profile/ProfileEditCard";
import Charts from "./Charts";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
  const { user } = useAuth();
  const { profile, plants, events, loading, saveProfile } =
    useProfileData(user);

  const [isEditing, setIsEditing] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  const handleSave = async (updates: any) => {
    await saveProfile(updates);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster position="top-right" />

      {!isEditing && (
        <>
          <ProfileCard profile={profile} onEdit={() => setIsEditing(true)} />

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md mt-8">
            <h2 className="text-xl font-bold mb-4 text-center">
              📊 My Statistics
            </h2>
            <Charts />
          </div>
        </>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center z-50 overflow-y-auto p-6">
          <ProfileEditCard
            profile={profile}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
