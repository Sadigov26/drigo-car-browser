import { DEFAULT_FILTERS } from "../constants/carOptions";

export const createInitialFilters = (urlValues) => {
  return {
    search: urlValues.search,
    transmission: urlValues.transmission,
    types: urlValues.types,
    minPrice: urlValues.minPrice,
    maxPrice: urlValues.maxPrice,
    seats: urlValues.seats,
    available: urlValues.available,
    favoritesOnly: urlValues.favoritesOnly,
    sort: urlValues.sort,
    page: urlValues.page,
  };
};

export const carFiltersReducer = (state, action) => {
  switch (action.type) {
    case "setSearch":
      return { ...state, search: action.value, page: DEFAULT_FILTERS.page };
    case "setTransmission":
      return {
        ...state,
        transmission: action.value,
        page: DEFAULT_FILTERS.page,
      };
    case "setTypes":
      return { ...state, types: action.value, page: DEFAULT_FILTERS.page };
    case "setMinPrice":
      return { ...state, minPrice: action.value, page: DEFAULT_FILTERS.page };
    case "setMaxPrice":
      return { ...state, maxPrice: action.value, page: DEFAULT_FILTERS.page };
    case "setSeats":
      return { ...state, seats: action.value, page: DEFAULT_FILTERS.page };
    case "setAvailable":
      return { ...state, available: action.value, page: DEFAULT_FILTERS.page };
    case "setFavoritesOnly":
      return {
        ...state,
        favoritesOnly: action.value,
        page: DEFAULT_FILTERS.page,
      };
    case "setSort":
      return { ...state, sort: action.value, page: DEFAULT_FILTERS.page };
    case "setPage":
      return { ...state, page: action.value };
    case "reset":
      return { ...DEFAULT_FILTERS };
    default:
      return state;
  }
};
