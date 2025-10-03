import { useState } from "react";
import { supabase } from "../services/supabaseClient";

interface Props {
  folder: string; // Carpeta en Supabase Storage
  initialUrl?: string; // URL inicial si ya hay imagen
  onUpload: (url: string) => void; // Callback cuando se sube la imagen
}

export default function ImageUpload({ folder, initialUrl, onUpload }: Props) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialUrl || "");
  const [errorMsg, setErrorMsg] = useState("");

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    setLoading(true);

    // Subida a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(folder)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setErrorMsg("Error al subir la imagen");
      console.error(uploadError);
      setLoading(false);
      return;
    }

    // Obtener URL pública
    const { data } = supabase.storage.from(folder).getPublicUrl(filePath);
    if (!data?.publicUrl) {
      setErrorMsg("No se pudo obtener la URL pública");
      setLoading(false);
      return;
    }
    setImageUrl(data.publicUrl);
    onUpload(data.publicUrl);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-start gap-2 mt-2">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg border"
        />
      )}

      <label
        className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Uploading..." : imageUrl ? "Change Image" : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          onChange={uploadFile}
          className="hidden"
          disabled={loading}
        />
      </label>

      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
    </div>
  );
}
