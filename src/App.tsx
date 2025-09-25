import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Plants from "./pages/Plants";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import Calendar from "./pages/Calendar";
import Charts from "./pages/Charts";
import Auth from "./pages/Auth";
import Users from "./pages/Users";

export default function App() {
  return (
    <Router>
      <Header />
      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/Auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<Map />} />
          <Route path="/users" element={<Users />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>
      </div>
    </Router>
  );
}
