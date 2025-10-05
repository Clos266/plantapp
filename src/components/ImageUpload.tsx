import { useState, useRef } from "react";
import { supabase } from "../services/supabaseClient";

interface Props {
  folder: string; // subcarpeta dentro del bucket 'profiles'
  initialUrl?: string;
  onUpload: (url: string) => void;
  clickablePreview?: boolean;
}

export default function ImageUpload({
  folder,
  initialUrl,
  onUpload,
  clickablePreview = false,
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

    // 👇 ahora el bucket es fijo: 'profiles'
    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      setErrorMsg("Error al subir la imagen (ver consola)");
      setLoading(false);
      return;
    }

    // 👇 obtener la URL pública del bucket correcto
    const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);

    if (!data?.publicUrl) {
      setErrorMsg("No se pudo obtener la URL pública");
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

  return (
    <div className="flex flex-col items-start gap-2 mt-2">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          onClick={handleImageClick}
          className={`w-32 h-32 object-cover rounded-lg border cursor-pointer transition-opacity ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
          }`}
        />
      )}

      {!clickablePreview && (
        <label
          className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer ${
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
