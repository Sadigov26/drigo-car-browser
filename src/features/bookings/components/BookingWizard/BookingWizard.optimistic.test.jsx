import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppProvider from "../../../../context/AppContext/AppProvider";
import BookingWizard from "./BookingWizard";

const apiMocks = vi.hoisted(() => ({
  cancelBooking: vi.fn(),
  createBooking: vi.fn(),
  getBookings: vi.fn(),
}));

vi.mock("../../../../api/mockApi", () => apiMocks);

const car = {
  id: 2,
  name: "Hyundai Accent",
  type: "Economy",
  transmission: "Manual",
  seats: 5,
  pricePerDay: 28,
  available: true,
};

const completeBookingForm = () => {
  fireEvent.change(screen.getByLabelText("Start date"), {
    target: { value: "2099-08-10" },
  });
  fireEvent.change(screen.getByLabelText("End date"), {
    target: { value: "2099-08-12" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));

  fireEvent.change(screen.getByLabelText("Full name"), {
    target: { value: "Test Driver" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "driver@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Driver license number"), {
    target: { value: "AZE7654321" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
};

describe("BookingWizard optimistic create", () => {
  beforeEach(() => {
    apiMocks.getBookings.mockReset();
    apiMocks.createBooking.mockReset();
    apiMocks.getBookings.mockResolvedValue([]);
  });

  it("shows the booking immediately and rolls back when saving fails", async () => {
    let rejectBooking;
    apiMocks.createBooking.mockImplementation(
      () =>
        new Promise((...promiseCallbacks) => {
          rejectBooking = promiseCallbacks[1];
        }),
    );

    render(
      <AppProvider>
        <BookingWizard car={car} />
      </AppProvider>,
    );
    await screen.findByText("No reserved dates for this car.");

    completeBookingForm();
    fireEvent.click(
      screen.getByRole("button", { name: "Confirm booking" }),
    );

    expect(screen.getByText("Booking confirmed")).toBeTruthy();
    expect(screen.getByText("Saving booking...")).toBeTruthy();

    await act(async () => {
      rejectBooking(new Error("Could not save this booking."));
    });

    await waitFor(() => {
      expect(screen.getByText("Review your booking")).toBeTruthy();
    });
    expect(screen.getByText("Could not save this booking.")).toBeTruthy();
  });
});
