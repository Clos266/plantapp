// src/pages/AuthPage.tsx
import { useState } from "react";
import { useAuthHandlers } from "../hooks/useAuthHandlers";
import { AuthForm } from "../components/forms/AuthForm";
import { AuthLayout } from "../components/layouts/AuthLayout";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignIn, handleSignUp } = useAuthHandlers(email, password);

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Plant Swap Auth
      </h1>
      <AuthForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    </AuthLayout>
  );
}
