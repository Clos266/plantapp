import { describe, it, expect } from "vitest";
import { supabase } from "./supabaseClient";

describe("supabaseClient", () => {
  it("should be defined", () => {
    expect(supabase).toBeDefined();
  });

  it("should have Supabase methods", () => {
    expect(typeof supabase.from).toBe("function");
    expect(typeof supabase.auth.signInWithPassword).toBe("function");
  });
});
