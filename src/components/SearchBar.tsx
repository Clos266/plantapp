import { useEffect, useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  // debounce para no saturar supabase
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query);
    }, 300); // espera 300ms después de escribir

    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  return (
    <div className="flex items-center w-full">
      <input
        type="text"
        placeholder="Buscar plantas o eventos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
      />
    </div>
  );
}
