import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppProvider from "./AppProvider";
import { USER_STORAGE_KEY } from "./authOptions";
import { useAppContext } from "./useAppContext";

const ContextTestView = () => {
  const { bookings, cancelBooking, toasts } = useAppContext();

  const cancelFirstBooking = () => {
    cancelBooking("b1").catch(() => {});
  };

  return (
    <div>
      <span>Bookings: {bookings.length}</span>
      <span>{toasts.map((toast) => toast.message).join(" ")}</span>
      <button type="button" onClick={cancelFirstBooking}>
        Cancel first
      </button>
    </div>
  );
};

describe("AppProvider booking state", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({ name: "Seed User", email: "seed@example.com" }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("rolls an optimistic cancellation back when the API fails", async () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0.5);

    render(
      <AppProvider>
        <ContextTestView />
      </AppProvider>,
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByText("Bookings: 4")).toBeTruthy();

    random.mockReturnValue(0.05);
    fireEvent.click(screen.getByRole("button", { name: "Cancel first" }));

    expect(screen.getByText("Bookings: 3")).toBeTruthy();

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByText("Bookings: 4")).toBeTruthy();
    expect(screen.getByText(/restored/)).toBeTruthy();
  });
});
