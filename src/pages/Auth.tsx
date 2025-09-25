import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";

export default function AuthPage() {
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      alert("User registered successfully!");
    } catch (err: any) {
      alert("Error registering: " + err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      alert("Login successful!");
    } catch (err: any) {
      alert("Error logging in: " + err.message);
    }
  };

  return (
    <div>
      <h1>Auth</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn}>Login</button>
    </div>
  );
}
