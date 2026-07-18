import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBookings } from "./useBookings";

describe("useBookings", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("restores an optimistically removed booking when cancel fails", async () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0.5);

    const { result } = renderHook(() => useBookings());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.bookings.some((booking) => booking.id === "b1")).toBe(
      true,
    );

    random.mockReturnValue(0.05);
    let cancellationRequest;
    act(() => {
      cancellationRequest = result.current.cancelBooking("b1");
    });

    expect(result.current.bookings.some((booking) => booking.id === "b1")).toBe(
      false,
    );

    await act(async () => {
      await vi.runAllTimersAsync();
      await cancellationRequest;
    });

    expect(result.current.bookings.some((booking) => booking.id === "b1")).toBe(
      true,
    );
    expect(result.current.mutationError).toContain("restored");
  });
});
