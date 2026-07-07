import {
  DEFAULT_FILTERS,
  SEAT_OPTIONS,
  SORT_OPTIONS,
  TRANSMISSION_OPTIONS,
  TYPE_OPTIONS,
} from "../constants/carOptions";

const getValidPriceParam = (value) => {
  if (!value) {
    return "";
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue) || numberValue < 0) {
    return "";
  }

  return String(numberValue);
};

const getValidPageParam = (value) => {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return DEFAULT_FILTERS.page;
  }

  return page;
};

export const getFilterValuesFromUrl = (searchParams) => {
  const search = searchParams.get("search") || DEFAULT_FILTERS.search;
  const transmission =
    searchParams.get("transmission") || DEFAULT_FILTERS.transmission;
  const types = (searchParams.get("types") || "")
    .split(",")
    .filter((type) => TYPE_OPTIONS.includes(type));
  const minPrice = getValidPriceParam(searchParams.get("minPrice"));
  const maxPrice = getValidPriceParam(searchParams.get("maxPrice"));
  const seats = searchParams.get("seats") || DEFAULT_FILTERS.seats;
  const available = searchParams.get("available") === "true";
  const favoritesOnly = searchParams.get("favorites") === "true";
  const sort = searchParams.get("sort") || DEFAULT_FILTERS.sort;
  const page = getValidPageParam(searchParams.get("page"));

  return {
    search,
    transmission: TRANSMISSION_OPTIONS.includes(transmission)
      ? transmission
      : DEFAULT_FILTERS.transmission,
    types,
    minPrice,
    maxPrice,
    seats: SEAT_OPTIONS.includes(seats) ? seats : DEFAULT_FILTERS.seats,
    available,
    favoritesOnly,
    sort: SORT_OPTIONS.includes(sort) ? sort : DEFAULT_FILTERS.sort,
    page,
  };
};

export const buildFilterSearchParams = (filters) => {
  const nextParams = new URLSearchParams();

  if (filters.search) {
    nextParams.set("search", filters.search);
  }

  if (filters.transmission !== DEFAULT_FILTERS.transmission) {
    nextParams.set("transmission", filters.transmission);
  }

  if (filters.types.length > 0) {
    nextParams.set("types", filters.types.join(","));
  }

  if (filters.minPrice !== DEFAULT_FILTERS.minPrice) {
    nextParams.set("minPrice", filters.minPrice);
  }

  if (filters.maxPrice !== DEFAULT_FILTERS.maxPrice) {
    nextParams.set("maxPrice", filters.maxPrice);
  }

  if (filters.seats !== DEFAULT_FILTERS.seats) {
    nextParams.set("seats", filters.seats);
  }

  if (filters.available) {
    nextParams.set("available", "true");
  }

  if (filters.favoritesOnly) {
    nextParams.set("favorites", "true");
  }

  if (filters.sort !== DEFAULT_FILTERS.sort) {
    nextParams.set("sort", filters.sort);
  }

  if (filters.page !== DEFAULT_FILTERS.page) {
    nextParams.set("page", String(filters.page));
  }

  return nextParams;
};
