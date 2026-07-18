import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearCarCaches } from "./carCache";
import {
  BOOKINGS_STORAGE_KEY,
  cancelBooking,
  createBooking,
  getBookings,
  getCachedCar,
  getCachedCars,
  getCar,
  getCars,
} from "./mockApi";

const finishRequest = async (request) => {
  await vi.runAllTimersAsync();
  return request;
};

describe("mockApi", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    localStorage.clear();
    clearCarCaches();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("filters and sorts cars before returning one page", async () => {
    const request = getCars({
      transmission: "Automatic",
      types: ["Sedan"],
      maxPrice: "50",
      available: true,
      sort: "highToLow",
      page: 1,
    });

    const result = await finishRequest(request);

    expect(result.total).toBe(3);
    expect(result.cars.map((car) => car.id)).toEqual([12, 7, 1]);
    expect(result.page).toBe(1);
  });

  it("returns a paged slice and total count", async () => {
    const result = await finishRequest(getCars({ page: 2 }));

    expect(result.total).toBe(12);
    expect(result.page).toBe(2);
    expect(result.pageCount).toBe(2);
    expect(result.cars.map((car) => car.id)).toEqual([12, 3, 10, 5, 9, 6]);
  });

  it("loads one car by id without requiring list state", async () => {
    const car = await finishRequest(getCar(6));

    expect(car).toMatchObject({ id: 6, name: "Toyota Land Cruiser" });
  });

  it("caches list and detail responses by their keys", async () => {
    const query = { search: "Toyota", page: 1 };

    await finishRequest(getCars(query));
    await finishRequest(getCar(6));

    expect(getCachedCars(query)?.total).toBe(3);
    expect(getCachedCar(6)).toEqual({
      car: expect.objectContaining({ id: 6 }),
      hasValue: true,
    });
  });

  it("invalidates list and affected detail caches after a booking", async () => {
    const query = { page: 1 };

    await finishRequest(getCars(query));
    await finishRequest(getCar(6));
    await finishRequest(
      createBooking({
        carId: 6,
        startDate: "2026-10-10",
        endDate: "2026-10-12",
        driver: "Cache Test",
      }),
    );

    expect(getCachedCars(query)).toBeNull();
    expect(getCachedCar(6)).toEqual({ car: null, hasValue: false });
  });

  it("persists created bookings and removes cancelled bookings", async () => {
    const bookingData = {
      carId: 2,
      startDate: "2026-09-10",
      endDate: "2026-09-12",
      driver: "Test User",
      userEmail: "test@example.com",
    };

    const createdBooking = await finishRequest(createBooking(bookingData));
    const userBookings = await finishRequest(
      getBookings({ name: "Test User", email: "test@example.com" }),
    );

    expect(userBookings).toContainEqual(createdBooking);
    expect(localStorage.getItem(BOOKINGS_STORAGE_KEY)).toContain(
      createdBooking.id,
    );

    await finishRequest(cancelBooking(createdBooking.id));
    const bookingsAfterCancel = await finishRequest(
      getBookings({ name: "Test User", email: "test@example.com" }),
    );

    expect(bookingsAfterCancel).toEqual([]);
  });
});
