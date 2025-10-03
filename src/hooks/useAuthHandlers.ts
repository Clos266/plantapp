import { signIn, signOut, signUp } from "../services/authService";

export function useAuthHandlers(email: string, password: string) {
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

  const handleSignOut = async () => {
    try {
      await signOut();
      alert("Logout successful!");
    } catch (err: any) {
      alert("Error logging out: " + err.message);
    }
  };

  return { handleSignIn, handleSignUp, handleSignOut };
}
