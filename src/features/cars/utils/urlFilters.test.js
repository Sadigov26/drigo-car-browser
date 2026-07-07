import { describe, expect, it } from "vitest";
import { buildFilterSearchParams, getFilterValuesFromUrl } from "./urlFilters";

describe("url filter helpers", () => {
  it("cleans unknown and invalid query params", () => {
    const params = new URLSearchParams(
      "transmission=Robot&types=Sedan,Truck&minPrice=abc&maxPrice=-20&seats=9&sort=random&page=-3",
    );

    expect(getFilterValuesFromUrl(params)).toMatchObject({
      transmission: "All",
      types: ["Sedan"],
      minPrice: "",
      maxPrice: "",
      seats: "All",
      sort: "lowToHigh",
      page: 1,
    });
  });

  it("builds the URL query from active filters only", () => {
    const params = buildFilterSearchParams({
      search: "toyota",
      transmission: "Automatic",
      types: ["Sedan", "SUV"],
      minPrice: "30",
      maxPrice: "100",
      seats: "5",
      available: true,
      favoritesOnly: true,
      sort: "nameAZ",
      page: 2,
    });

    expect(params.toString()).toBe(
      "search=toyota&transmission=Automatic&types=Sedan%2CSUV&minPrice=30&maxPrice=100&seats=5&available=true&favorites=true&sort=nameAZ&page=2",
    );
  });
});
