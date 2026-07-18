import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BOOKINGS_STORAGE_KEY } from "../../../../api/mockApi";
import AppProvider from "../../../../context/AppContext/AppProvider";
import BookingWizard from "./BookingWizard";

const car = {
  id: 1,
  name: "Toyota Corolla",
  type: "Sedan",
  transmission: "Automatic",
  seats: 5,
  pricePerDay: 35,
  available: true,
};

describe("BookingWizard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-18T12:00:00"));
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("completes all three steps and saves a valid booking", async () => {
    render(
      <AppProvider>
        <BookingWizard car={car} />
      </AppProvider>,
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-08-10" },
    });
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-08-12" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Driver details")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Sadig Sadigov" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "sadig@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Driver license number"), {
      target: { value: "AZE1234567" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Review your booking")).toBeTruthy();
    expect(screen.getByText("$95")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "Confirm booking" }),
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByText("Booking confirmed")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          carId: 1,
          days: 2,
          totalPrice: 95,
          userEmail: "sadig@example.com",
        }),
      ]),
    );
  });

  it("blocks a date range that overlaps a saved booking", async () => {
    render(
      <AppProvider>
        <BookingWizard car={car} />
      </AppProvider>,
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-07-21" },
    });
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-07-23" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      screen.getByText(
        "These dates overlap a booking from 2026-07-20 to 2026-07-24.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Choose your rental dates")).toBeTruthy();
  });
});
