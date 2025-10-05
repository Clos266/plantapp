import { Button } from "../ui/Button";

interface ProfileCardProps {
  profile: {
    username?: string;
    ciudad?: string;
    cp?: string;
    avatar_url?: string;
  };
  onEdit: () => void;
}

export default function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md">
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

        <Button onClick={onEdit}>Edit Profile</Button>
      </div>
    </div>
  );
}
