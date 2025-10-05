import { useState, useRef } from "react";
import { supabase } from "../services/supabaseClient";

interface Props {
  folder: string;
  initialUrl?: string;
  onUpload: (url: string) => void;
  clickablePreview?: boolean;
  size?: "sm" | "md" | "lg" | "xl"; // 👈 NEW
}

export default function ImageUpload({
  folder,
  initialUrl,
  onUpload,
  clickablePreview = false,
  size = "md",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialUrl || "");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    setLoading(true);

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      setErrorMsg("Error uploading image (see console)");
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);
    if (!data?.publicUrl) {
      setErrorMsg("Could not get public URL");
      setLoading(false);
      return;
    }

    setImageUrl(data.publicUrl);
    onUpload(data.publicUrl);
    setLoading(false);
  };

  const handleImageClick = () => {
    if (clickablePreview && !loading) {
      fileInputRef.current?.click();
    }
  };

  // 🎨 Size map for consistent scaling
  const sizeClasses = {
    sm: "w-16 h-16", // 64px
    md: "w-24 h-24", // 96px
    lg: "w-32 h-32", // 128px
    xl: "w-40 h-40", // 160px
  };

  return (
    <div className="flex flex-col items-start gap-2 mt-2">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          onClick={handleImageClick}
          className={`${
            sizeClasses[size]
          } object-cover rounded-full border cursor-pointer ${
            loading ? "opacity-50" : ""
          }`}
        />
      )}

      {!clickablePreview && (
        <label
          className={`font-semibold rounded-lg transition-colors focus:outline-none text-center py-2 px-3 text-sm bg-blue-500 text-white hover:bg-blue-600 dark:bg-green-600 dark:hover:bg-green-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? "Uploading..."
            : imageUrl
            ? "Change Image"
            : "Upload Image"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={uploadFile}
            className="hidden"
            disabled={loading}
          />
        </label>
      )}

      {clickablePreview && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={uploadFile}
          className="hidden"
          disabled={loading}
        />
      )}

      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
    </div>
  );
}
