// src/hooks/useSupabaseData.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export function useSupabaseData() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga del usuario autenticado
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setError("Usuario no autenticado");
      } else {
        setUserId(data.user.id);
      }
      setLoading(false);
    })();
  }, []);

  // Funciones genéricas
  async function fetchTable<T = any>(
    table: string,
    filters?: Record<string, any>
  ): Promise<T[]> {
    let query = supabase.from(table).select("*");
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async function insertRow<T = any>(table: string, payload: Partial<T>) {
    const { data, error } = await supabase.from(table).insert(payload).select();
    if (error) throw error;
    return data?.[0];
  }

  async function updateRow<T = any>(
    table: string,
    id: number,
    updates: Partial<T>
  ) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data?.[0];
  }

  async function deleteRow(table: string, id: number) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
  }

  return {
    userId,
    loading,
    error,
    fetchTable,
    insertRow,
    updateRow,
    deleteRow,
  };
}
