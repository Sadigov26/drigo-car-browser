import { describe, expect, it } from "vitest";
import {
  calculateBookingPrice,
  getRentalDays,
  validateDateRange,
  validateDriverDetails,
} from "./bookingValidation";

describe("booking validation", () => {
  it("calculates rental days and the total price", () => {
    expect(getRentalDays("2026-08-10", "2026-08-13")).toBe(3);
    expect(calculateBookingPrice("2026-08-10", "2026-08-13", 35)).toEqual({
      days: 3,
      rentalCost: 105,
      serviceFee: 25,
      total: 130,
    });
  });

  it("rejects past dates and a rental shorter than two days", () => {
    expect(
      validateDateRange(
        { startDate: "2026-07-17", endDate: "2026-07-20" },
        "2026-07-18",
      ).startDate,
    ).toBe("Start date cannot be in the past.");

    expect(
      validateDateRange(
        { startDate: "2026-07-20", endDate: "2026-07-21" },
        "2026-07-18",
      ).endDate,
    ).toBe("Minimum rental length is 2 days.");
  });

  it("requires the end date to be after the start date", () => {
    const errors = validateDateRange(
      { startDate: "2026-07-22", endDate: "2026-07-22" },
      "2026-07-18",
    );

    expect(errors.endDate).toBe("End date must be after the start date.");
  });

  it("validates required driver fields and email format", () => {
    expect(
      validateDriverDetails({
        fullName: "",
        email: "wrong-email",
        licenseNumber: "",
      }),
    ).toEqual({
      fullName: "Full name is required.",
      email: "Enter a valid email address.",
      licenseNumber: "Driver license number is required.",
    });
  });
});
