import ImageUpload from "../ImageUpload";
import { Button } from "../ui/Button";

interface ProfileCardProps {
  profile: {
    username?: string;
    ciudad?: string;
    cp?: string;
    avatar_url?: string;
  };
  onEdit: () => void;
  onPhotoChange?: (url: string) => void; // nuevo callback opcional
}

export default function ProfileCard({
  profile,
  onEdit,
  onPhotoChange,
}: ProfileCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 w-full max-w-md flex items-center gap-5">
      {/* Avatar clickeable */}
      <div className="flex-shrink-0">
        <ImageUpload
          folder="avatars"
          initialUrl={profile.avatar_url}
          onUpload={onPhotoChange ?? (() => {})}
          clickablePreview
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 space-y-1">
        <p className="text-lg font-semibold">{profile.username || "—"}</p>
        <p className="text-gray-700 dark:text-gray-300">
          {profile.ciudad || "—"}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          ZIP: {profile.cp || "—"}
        </p>

        <div className="pt-2">
          <Button variant="primary" onClick={onEdit}>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
