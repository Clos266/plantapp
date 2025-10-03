import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Plants from "./pages/Plants";
import Map from "./pages/Map";
import Calendar from "./pages/Calendar";
import Charts from "./pages/Charts";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Header fijo arriba */}
        <Header />

        <div className="">
          {/* Sidebar fijo a la izquierda */}
          <Sidebar />

          {/* Contenido principal */}
          <main className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/plants" element={<Plants />} />
              <Route path="/map" element={<Map />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
