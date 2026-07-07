export const TRANSMISSION_OPTIONS = ["All", "Automatic", "Manual"];

export const TYPE_OPTIONS = ["All", "Economy", "Sedan", "SUV", "Luxury"];

export const SORT_OPTIONS = ["lowToHigh", "highToLow", "nameAZ", "nameZA"];

export const SEAT_OPTIONS = ["All", "5", "7"];

export const PAGE_SIZE = 6;

export const DEFAULT_FILTERS = {
  search: "",
  transmission: "All",
  types: [],
  minPrice: "",
  maxPrice: "",
  seats: "All",
  available: false,
  sort: "lowToHigh",
  page: 1,
};
