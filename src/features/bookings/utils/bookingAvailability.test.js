import { describe, expect, it } from "vitest";
import {
  dateRangesOverlap,
  findOverlappingBooking,
  getBookingsForCar,
  splitBookingsByDate,
} from "./bookingAvailability";

const bookings = [
  {
    id: "b1",
    carId: 1,
    startDate: "2026-07-20",
    endDate: "2026-07-24",
  },
  {
    id: "b2",
    carId: 2,
    startDate: "2026-07-22",
    endDate: "2026-07-25",
  },
];

describe("booking availability", () => {
  it("detects dates that overlap an existing range", () => {
    expect(
      dateRangesOverlap(
        "2026-07-22",
        "2026-07-26",
        "2026-07-20",
        "2026-07-24",
      ),
    ).toBe(true);
  });

  it("allows a new booking to start when the old one ends", () => {
    expect(
      dateRangesOverlap(
        "2026-07-24",
        "2026-07-27",
        "2026-07-20",
        "2026-07-24",
      ),
    ).toBe(false);
  });

  it("finds conflicts only for the same car", () => {
    expect(
      findOverlappingBooking(bookings, {
        carId: 1,
        startDate: "2026-07-21",
        endDate: "2026-07-23",
      })?.id,
    ).toBe("b1");

    expect(
      findOverlappingBooking(bookings, {
        carId: 3,
        startDate: "2026-07-21",
        endDate: "2026-07-23",
      }),
    ).toBeUndefined();
  });

  it("filters car ranges and separates upcoming from past bookings", () => {
    expect(getBookingsForCar(bookings, 1).map((booking) => booking.id)).toEqual([
      "b1",
    ]);
    expect(splitBookingsByDate(bookings, "2026-07-24")).toEqual({
      upcoming: [bookings[0], bookings[1]],
      past: [],
    });
  });
});
