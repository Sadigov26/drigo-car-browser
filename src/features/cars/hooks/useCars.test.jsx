import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearCarCaches } from "../../../api/carCache";
import { getCars } from "../../../api/mockApi";
import { useCars } from "./useCars";

const createQuery = (search = "") => ({
  search,
  transmission: "All",
  types: [],
  minPrice: "",
  maxPrice: "",
  seats: "All",
  available: false,
  favoritesOnly: false,
  favoriteIds: [],
  sort: "lowToHigh",
  page: 1,
});

describe("useCars", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearCarCaches();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("keeps the latest result when an older request finishes later", async () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0)
      .mockReturnValue(0.5);

    const { result, rerender } = renderHook(
      ({ query }) => useCars(query),
      { initialProps: { query: createQuery("Toyota") } },
    );

    rerender({ query: createQuery("Kia") });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });

    expect(result.current.cars.map((car) => car.name)).toEqual([
      "Kia Rio",
      "Kia Sportage",
    ]);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });

    expect(result.current.cars.map((car) => car.name)).toEqual([
      "Kia Rio",
      "Kia Sportage",
    ]);
  });

  it("shows cached cars immediately while revalidating", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const query = createQuery("Toyota");
    const preloadRequest = getCars(query);

    await vi.runAllTimersAsync();
    await preloadRequest;

    const { result } = renderHook(() => useCars(query));

    expect(result.current.loading).toBe(false);
    expect(result.current.updating).toBe(true);
    expect(result.current.total).toBe(3);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.updating).toBe(false);
    expect(result.current.total).toBe(3);
  });
});
