import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCalendarEvents } from "./useCalendarEvents";

// Mock de servicios
import * as eventService from "../services/eventService";
import * as plantService from "../services/plantService";
import * as swapPointService from "../services/swapPointService";
import { supabase } from "../services/supabaseClient";

vi.mock("../services/eventService");
vi.mock("../services/plantService");
vi.mock("../services/swapPointService");
vi.mock("../services/supabaseClient");

describe("useCalendarEvents", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Mock supabase auth
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: "user123" } },
    });

    // Mock plantService
    (plantService.fetchPlantEvents as any).mockResolvedValue([]);

    // Mock eventService
    (eventService.fetchUserEvents as any).mockResolvedValue([]);
    (eventService.addEvent as any).mockResolvedValue(undefined);

    // Mock swapPointService
    (swapPointService.fetchSwapPoints as any).mockResolvedValue([]);
  });

  it("should start with empty state", () => {
    const { result } = renderHook(() => useCalendarEvents());
    expect(result.current.events).toEqual([]);
    expect(result.current.swapPoints).toEqual([]);
  });

  it("should update newEvent", () => {
    const { result } = renderHook(() => useCalendarEvents());

    act(() => {
      result.current.setNewEvent({
        title: "Test",
        date: "2025-10-05",
        swap_point_id: "1",
      });
    });

    expect(result.current.newEvent.title).toBe("Test");
  });

  it("should add a new event and reset state", async () => {
    const { result } = renderHook(() => useCalendarEvents());

    act(() => {
      result.current.setNewEvent({
        title: "My Event",
        date: "2025-10-10",
        swap_point_id: "2",
      });
    });

    await act(async () => {
      await result.current.addEvent();
    });

    expect(eventService.addEvent).toHaveBeenCalled();
    expect(result.current.newEvent).toEqual({
      title: "",
      date: "",
      swap_point_id: "",
    });
  });

  it("should handle addEvent errors", async () => {
    const alertMock = vi.spyOn(global, "alert").mockImplementation(() => {});
    (eventService.addEvent as any).mockRejectedValueOnce(
      new Error("Failed to add event")
    );

    const { result } = renderHook(() => useCalendarEvents());

    await act(async () => {
      await result.current.addEvent();
    });

    expect(alertMock).toHaveBeenCalledWith("Failed to add event");
  });
});
