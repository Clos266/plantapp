import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        Home
      </Link>
      <Link to="/Auth" style={{ marginRight: "1rem" }}>
        Auth
      </Link>
      <Link to="/plants" style={{ marginRight: "1rem" }}>
        Plants
      </Link>
      <Link to="/profile" style={{ marginRight: "1rem" }}>
        Profile
      </Link>
      <Link to="/map" style={{ marginRight: "1rem" }}>
        Map
      </Link>
      <Link to="/calendar" style={{ marginRight: "1rem" }}>
        Calendar
      </Link>
      <Link to="/charts">Charts</Link>
      <Link to="/users" style={{ marginLeft: "1rem" }}>
        Users
      </Link>
    </nav>
  );
}
