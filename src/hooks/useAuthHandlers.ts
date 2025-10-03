// src/hooks/useAuthHandlers.ts
import { useAuth } from "../contexts/AuthProvider";

export function useAuthHandlers(email: string, password: string) {
  const { signUp, signIn } = useAuth();

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

  return { handleSignIn, handleSignUp };
}
