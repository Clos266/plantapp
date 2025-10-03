// src/components/forms/AuthForm.tsx
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
          onClick={onSignIn}
          className="bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Login
        </button>
        <button
          onClick={onSignUp}
          className="bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Sign Up
        </button>
      </div>
    </>
  );
}
