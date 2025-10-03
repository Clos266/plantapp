import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authService from "../services/authService";
import { supabase } from "../services/supabaseClient";

// Mock de Supabase
vi.mock("../services/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls supabase.auth.signUp and creates profile", async () => {
    (supabase.auth.signUp as any).mockResolvedValueOnce({
      data: { user: { id: "123", email: "test@test.com" } },
      error: null,
    });

    await authService.signUp("test@test.com", "123456");

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "123456",
    });
    expect(supabase.from).toHaveBeenCalledWith("profiles");
  });

  it("calls supabase.auth.signInWithPassword", async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      error: null,
    });

    await authService.signIn("test@test.com", "123456");

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "123456",
    });
  });

  it("calls supabase.auth.signOut", async () => {
    (supabase.auth.signOut as any).mockResolvedValue({ error: null });

    await authService.signOut();

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
