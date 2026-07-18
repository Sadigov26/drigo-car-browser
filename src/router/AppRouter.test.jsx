import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppProvider from "../context/AppContext/AppProvider";
import { USER_STORAGE_KEY } from "../context/AppContext/authOptions";
import AppRouter from "./AppRouter";

describe("protected routes", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("returns the user to My Bookings after sign in", async () => {
    render(
      <MemoryRouter initialEntries={["/bookings"]}>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Sign in", level: 1 }),
    ).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Sadig Sadigov" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "sadig@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      screen.getByRole("heading", { name: "My Bookings", level: 1 }),
    ).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(USER_STORAGE_KEY))).toEqual({
      name: "Sadig Sadigov",
      email: "sadig@example.com",
    });

    await act(async () => {
      await vi.runAllTimersAsync();
    });
  });

  it("keeps a persisted user signed in after a new render", async () => {
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({ name: "Saved User", email: "saved@example.com" }),
    );

    render(
      <MemoryRouter initialEntries={["/bookings"]}>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "My Bookings", level: 1 }),
    ).toBeTruthy();

    await act(async () => {
      await vi.runAllTimersAsync();
    });
  });
});
