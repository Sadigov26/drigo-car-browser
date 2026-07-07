import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  TRANSMISSION_OPTIONS,
  TYPE_OPTIONS,
} from "../constants/carOptions";

export const getFilterValuesFromUrl = (searchParams) => {
  const search = searchParams.get("search") || DEFAULT_FILTERS.search;
  const transmission =
    searchParams.get("transmission") || DEFAULT_FILTERS.transmission;
  const type = searchParams.get("type") || DEFAULT_FILTERS.type;
  const available = searchParams.get("available") === "true";
  const sort = searchParams.get("sort") || DEFAULT_FILTERS.sort;

  return {
    search,
    transmission: TRANSMISSION_OPTIONS.includes(transmission)
      ? transmission
      : DEFAULT_FILTERS.transmission,
    type: TYPE_OPTIONS.includes(type) ? type : DEFAULT_FILTERS.type,
    available,
    sort: SORT_OPTIONS.includes(sort) ? sort : DEFAULT_FILTERS.sort,
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

  if (filters.type !== DEFAULT_FILTERS.type) {
    nextParams.set("type", filters.type);
  }

  if (filters.available) {
    nextParams.set("available", "true");
  }

  if (filters.sort !== DEFAULT_FILTERS.sort) {
    nextParams.set("sort", filters.sort);
  }

  return nextParams;
};
