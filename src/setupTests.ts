// src/setupTests.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock global alert (si no existe en Node)
if (!global.alert) {
  global.alert = vi.fn();
}
