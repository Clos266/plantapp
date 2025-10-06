import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Plants from "./components/plants/Plants";
import Map from "./pages/Map";
import Calendar from "./components/layouts/Calendar";
import Charts from "./pages/Charts";
import Auth from "./pages/AuthPage";
import { Toaster } from "react-hot-toast";
import Swap from "./pages/Swap";

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            iconTheme: { primary: "#4ade80", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />

      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* 📚 Sidebar fijo a la izquierda */}
          <Sidebar />

          {/* 🧩 Contenido principal */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/plants" element={<Plants />} />
              <Route path="/map" element={<Map />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/swap" element={<Swap />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
