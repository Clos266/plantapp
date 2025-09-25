import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Profile {
  id: string;
  username?: string;
  email?: string;
  ciudad?: string;
  cp?: string;
}

export default function Users() {
  const [users, setUsers] = useState<Profile[]>([]);

  // Cargar todos los perfiles
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, email, ciudad, cp");

    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      setUsers(data || []);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.username || "No username"}</strong> - {user.email} -{" "}
            {user.ciudad || "No city"} ({user.cp || "No CP"})
          </li>
        ))}
      </ul>
    </div>
  );
}
