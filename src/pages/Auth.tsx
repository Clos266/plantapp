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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Plant Swap Auth
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleSignIn}
            className="bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            className="bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
