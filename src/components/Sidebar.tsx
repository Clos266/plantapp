import { Link } from "react-router-dom";
import { Home, User, MapPin, ArrowLeftRight } from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { to: "/", label: "Home", icon: <Home size={20} /> },
    { to: "/map", label: "Mapa", icon: <MapPin size={20} /> },
    { to: "/swap", label: "Swap", icon: <ArrowLeftRight size={20} /> },
    { to: "/profile", label: "Perfil", icon: <User size={20} /> },
  ];

  return (
    <aside
      className="bg-white text-gray-700 p-3 md:p-5
      flex md:flex-row flex-col md:items-center md:justify-start gap-3
      w-full fixed bottom-0 md:top-0 md:left-0 md:h-16 z-50 shadow-lg"
    >
      <nav className="flex md:flex-row flex-1 justify-around md:justify-start gap-2 md:gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col md:flex-row items-center md:gap-2 p-2 rounded 
            hover:bg-green-100 transition-colors"
          >
            <span className="md:hidden text-green-600">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
