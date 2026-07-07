import { describe, expect, it } from "vitest";
import { filterCars, sortCars } from "./carList";

const cars = [
  {
    id: 1,
    name: "Toyota Corolla",
    type: "Sedan",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 35,
    available: true,
  },
  {
    id: 2,
    name: "Kia Rio",
    type: "Economy",
    transmission: "Manual",
    seats: 5,
    pricePerDay: 26,
    available: false,
  },
  {
    id: 3,
    name: "Toyota Land Cruiser",
    type: "SUV",
    transmission: "Automatic",
    seats: 7,
    pricePerDay: 150,
    available: false,
  },
  {
    id: 4,
    name: "BMW 5 Series",
    type: "Luxury",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 130,
    available: true,
  },
];

const defaultFilters = {
  search: "",
  transmission: "All",
  types: [],
  minPrice: "",
  maxPrice: "",
  seats: "All",
  available: false,
  favoritesOnly: false,
  favoriteIds: [],
};

describe("filterCars", () => {
  it("combines filters with AND logic", () => {
    const result = filterCars(cars, {
      ...defaultFilters,
      search: "toyota",
      transmission: "Automatic",
      types: ["Sedan"],
      minPrice: "30",
      maxPrice: "60",
      seats: "5",
      available: true,
    });

    expect(result).toEqual([cars[0]]);
  });

  it("filters favorites only by favorite ids", () => {
    const result = filterCars(cars, {
      ...defaultFilters,
      favoritesOnly: true,
      favoriteIds: [2, 4],
    });

    expect(result.map((car) => car.id)).toEqual([2, 4]);
  });
});

describe("sortCars", () => {
  it("sorts by price from high to low", () => {
    const result = sortCars(cars, "highToLow");

    expect(result.map((car) => car.pricePerDay)).toEqual([150, 130, 35, 26]);
  });

  it("sorts by name from A to Z", () => {
    const result = sortCars(cars, "nameAZ");

    expect(result.map((car) => car.name)).toEqual([
      "BMW 5 Series",
      "Kia Rio",
      "Toyota Corolla",
      "Toyota Land Cruiser",
    ]);
  });
});
