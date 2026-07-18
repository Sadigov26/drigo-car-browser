import { beforeEach, describe, expect, it } from "vitest";
import {
  clearBookingDraft,
  readBookingDraft,
  saveBookingDraft,
} from "./bookingDraft";

describe("booking draft storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("restores a saved draft for the same car and user", () => {
    const draft = {
      step: 2,
      startDate: "2026-08-10",
      endDate: "2026-08-12",
      driver: {
        fullName: "Saved Driver",
        email: "driver@example.com",
        licenseNumber: "AZE1234567",
      },
    };

    saveBookingDraft(1, "driver@example.com", draft);

    expect(readBookingDraft(1, "driver@example.com")).toEqual(draft);
  });

  it("returns safely when stored data is invalid", () => {
    sessionStorage.setItem(
      "drigo-booking-draft:1:driver@example.com",
      "not-json",
    );

    expect(readBookingDraft(1, "driver@example.com")).toBeNull();
    expect(() => clearBookingDraft(1, "driver@example.com")).not.toThrow();
  });
});
