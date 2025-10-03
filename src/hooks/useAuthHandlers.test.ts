import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthHandlers } from "../hooks/useAuthHandlers";
import * as authService from "../services/authService";

// 🔹 Mock global de alert
global.alert = vi.fn();

describe("useAuthHandlers", () => {
  const email = "test@test.com";
  const password = "123456";

  beforeEach(() => {
    vi.clearAllMocks(); // limpia mocks antes de cada test
  });

  it("calls signIn and signUp from authService", async () => {
    const signInMock = vi
      .spyOn(authService, "signIn")
      .mockResolvedValueOnce(undefined);
    const signUpMock = vi
      .spyOn(authService, "signUp")
      .mockResolvedValueOnce(undefined);

    const { handleSignIn, handleSignUp } = useAuthHandlers(email, password);

    await handleSignIn();
    await handleSignUp();

    expect(signInMock).toHaveBeenCalledWith(email, password);
    expect(signUpMock).toHaveBeenCalledWith(email, password);
  });

  it("handles signIn errors gracefully", async () => {
    vi.spyOn(authService, "signIn").mockRejectedValueOnce(
      new Error("Login failed")
    );

    const { handleSignIn } = useAuthHandlers(email, password);
    await expect(handleSignIn()).resolves.toBeUndefined();

    expect(alert).toHaveBeenCalledWith("Error logging in: Login failed");
  });

  it("handles signUp errors gracefully", async () => {
    vi.spyOn(authService, "signUp").mockRejectedValueOnce(
      new Error("Signup failed")
    );

    const { handleSignUp } = useAuthHandlers(email, password);
    await expect(handleSignUp()).resolves.toBeUndefined();

    expect(alert).toHaveBeenCalledWith("Error registering: Signup failed");
  });
});
