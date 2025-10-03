// src/components/forms/AuthForm.tsx
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

type AuthFormProps = {
  email: string;
  password: string;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  onSignIn: () => void;
  onSignUp: () => void;
};

export function AuthForm({
  email,
  password,
  setEmail,
  setPassword,
  onSignIn,
  onSignUp,
}: AuthFormProps) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <Button onClick={onSignIn} variant="primary">
          Login
        </Button>
        <Button onClick={onSignUp} variant="secondary">
          Sign Up
        </Button>
      </div>
    </>
  );
}
