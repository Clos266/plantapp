import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface ProfileEditCardProps {
  profile: {
    username?: string;
    ciudad?: string;
    cp?: string;
  };
  onSave: (updates: any) => Promise<void>;
  onCancel: () => void;
}

export default function ProfileEditCard({
  profile,
  onSave,
  onCancel,
}: ProfileEditCardProps) {
  const [formData, setFormData] = useState({
    username: profile.username || "",
    ciudad: profile.ciudad || "",
    cp: profile.cp || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Username
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>

        <label>
          City
          <Input
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
          />
        </label>

        <label>
          ZIP Code
          <Input name="cp" value={formData.cp} onChange={handleChange} />
        </label>

        <div className="flex flex-col gap-3 mt-4 w-full">
          <Button type="submit">Save</Button>
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
