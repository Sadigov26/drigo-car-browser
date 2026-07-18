import seedBookings from "../data/bookings.json";
import cars from "../data/cars.json";
import {
  DEFAULT_FILTERS,
  PAGE_SIZE,
} from "../features/cars/constants/carOptions";
import { findOverlappingBooking } from "../features/bookings/utils/bookingAvailability";
import {
  clampPage,
  filterCars,
  getPageCount,
  paginateCars,
  sortCars,
} from "../features/cars/utils/carList";
import {
  getCacheVersion,
  invalidateCarCaches,
  readDetailCache,
  readListCache,
  writeDetailCache,
  writeListCache,
} from "./carCache";

export const BOOKINGS_STORAGE_KEY = "drigo-bookings";
export const BOOKING_OVERLAP_ERROR = "BOOKING_OVERLAP";

const FAILURE_RATE = 0.1;
const MIN_DELAY = 600;
const MAX_DELAY = 1200;
let memoryBookings = [...seedBookings];

const getRandomDelay = () => {
  return MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1));
};

const runMockRequest = (work, errorMessage) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error(errorMessage));
        return;
      }

      try {
        resolve(work());
      } catch (error) {
        reject(error);
      }
    }, getRandomDelay());
  });
};

const copyBookings = (bookings) => {
  return bookings.map((booking) => ({ ...booking }));
};

const readBookings = () => {
  if (typeof localStorage === "undefined") {
    return copyBookings(memoryBookings);
  }

  try {
    const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);

    if (!savedBookings) {
      localStorage.setItem(
        BOOKINGS_STORAGE_KEY,
        JSON.stringify(seedBookings),
      );
      return copyBookings(seedBookings);
    }

    const parsedBookings = JSON.parse(savedBookings);
    return Array.isArray(parsedBookings)
      ? copyBookings(parsedBookings)
      : copyBookings(seedBookings);
  } catch {
    return copyBookings(seedBookings);
  }
};

const saveBookings = (bookings) => {
  memoryBookings = copyBookings(bookings);

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }
};

const enrichBooking = (booking) => {
  const car = cars.find((carItem) => carItem.id === Number(booking.carId));

  return {
    ...booking,
    car: car ? { ...car } : null,
    carName: booking.carName || car?.name || "Unknown car",
  };
};

const normalizeCarQuery = (query) => {
  return {
    ...DEFAULT_FILTERS,
    ...query,
    types: Array.isArray(query.types) ? [...query.types] : [],
    favoriteIds: Array.isArray(query.favoriteIds)
      ? [...query.favoriteIds]
      : [],
  };
};

export const getCarsQueryKey = (query = {}) => {
  const normalizedQuery = normalizeCarQuery(query);

  return JSON.stringify({
    search: normalizedQuery.search,
    transmission: normalizedQuery.transmission,
    types: [...normalizedQuery.types].sort(),
    minPrice: normalizedQuery.minPrice,
    maxPrice: normalizedQuery.maxPrice,
    seats: normalizedQuery.seats,
    available: normalizedQuery.available,
    favoritesOnly: normalizedQuery.favoritesOnly,
    favoriteIds: [...normalizedQuery.favoriteIds].sort(
      (firstId, secondId) => firstId - secondId,
    ),
    sort: normalizedQuery.sort,
    page: normalizedQuery.page,
  });
};

export const getCachedCars = (query = {}) => {
  return readListCache(getCarsQueryKey(query));
};

export const getCachedCar = (id) => {
  return readDetailCache(id);
};

export const getCars = (query = {}) => {
  const normalizedQuery = normalizeCarQuery(query);
  const queryKey = getCarsQueryKey(normalizedQuery);
  const requestVersion = getCacheVersion();

  return runMockRequest(() => {
    const filteredCars = filterCars(cars, normalizedQuery);
    const sortedCars = sortCars(filteredCars, normalizedQuery.sort);
    const pageCount = getPageCount(sortedCars.length, PAGE_SIZE);
    const requestedPage = Number(normalizedQuery.page);
    const validPage = Number.isInteger(requestedPage) ? requestedPage : 1;
    const page = clampPage(validPage, pageCount);
    const result = {
      cars: paginateCars(sortedCars, page, PAGE_SIZE).map((car) => ({
        ...car,
      })),
      total: sortedCars.length,
      page,
      pageCount,
    };

    writeListCache(queryKey, result, requestVersion);
    return result;
  }, "Could not load cars. Please try again.");
};

export const getCar = (id) => {
  const carId = Number(id);
  const requestVersion = getCacheVersion();

  return runMockRequest(() => {
    const car = cars.find((carItem) => carItem.id === carId);
    const result = car ? { ...car } : null;

    writeDetailCache(carId, result, requestVersion);
    return result;
  }, "Could not load the car. Please try again.");
};

export const getBookings = (user) => {
  return runMockRequest(() => {
    const bookings = readBookings().map(enrichBooking);

    if (!user) {
      return copyBookings(bookings);
    }

    const userEmail = typeof user === "string" ? user : user.email;
    const userName = typeof user === "object" ? user.name : "";

    return bookings.filter((booking) => {
      return (
        (userEmail && booking.userEmail === userEmail) ||
        (userName && booking.driver === userName)
      );
    });
  }, "Could not load bookings. Please try again.");
};

export const createBooking = (data) => {
  return runMockRequest(() => {
    const bookings = readBookings();
    const overlappingBooking = findOverlappingBooking(bookings, data);

    if (overlappingBooking) {
      const overlapError = new Error(
        `This car is already booked from ${overlappingBooking.startDate} to ${overlappingBooking.endDate}.`,
      );
      overlapError.code = BOOKING_OVERLAP_ERROR;
      throw overlapError;
    }

    const booking = {
      ...data,
      id: `booking-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    saveBookings([...bookings, booking]);
    invalidateCarCaches(booking.carId);
    return enrichBooking(booking);
  }, "Could not create the booking. Please try again.");
};

export const cancelBooking = (id) => {
  return runMockRequest(() => {
    const bookings = readBookings();
    const booking = bookings.find((item) => item.id === id);

    if (!booking) {
      throw new Error("Booking not found.");
    }

    saveBookings(bookings.filter((item) => item.id !== id));
    invalidateCarCaches(booking.carId);
    return { ...booking };
  }, "Could not cancel the booking. Please try again.");
};
