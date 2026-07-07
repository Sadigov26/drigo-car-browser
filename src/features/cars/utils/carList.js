export const filterCars = (cars, filters) => {
  return cars.filter((car) => {
    const matchesSearch = car.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesTransmission =
      filters.transmission === "All" ||
      car.transmission === filters.transmission;

    const matchesType =
      filters.types.length === 0 || filters.types.includes(car.type);

    const minPrice = Number(filters.minPrice);
    const maxPrice = Number(filters.maxPrice);
    const hasMinPrice = filters.minPrice !== "";
    const hasMaxPrice = filters.maxPrice !== "";
    const matchesMinPrice = !hasMinPrice || car.pricePerDay >= minPrice;
    const matchesMaxPrice = !hasMaxPrice || car.pricePerDay <= maxPrice;

    const matchesSeats =
      filters.seats === "All" || car.seats === Number(filters.seats);

    const matchesAvailability = !filters.available || car.available;
    const matchesFavorite =
      !filters.favoritesOnly || filters.favoriteIds.includes(car.id);

    return (
      matchesSearch &&
      matchesTransmission &&
      matchesType &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesSeats &&
      matchesAvailability &&
      matchesFavorite
    );
  });
};

export const sortCars = (cars, sortOrder) => {
  return [...cars].sort((firstCar, secondCar) => {
    if (sortOrder === "highToLow") {
      return secondCar.pricePerDay - firstCar.pricePerDay;
    }

    if (sortOrder === "nameAZ") {
      return firstCar.name.localeCompare(secondCar.name);
    }

    if (sortOrder === "nameZA") {
      return secondCar.name.localeCompare(firstCar.name);
    }

    return firstCar.pricePerDay - secondCar.pricePerDay;
  });
};

export const getPageCount = (itemsCount, pageSize) => {
  return Math.max(1, Math.ceil(itemsCount / pageSize));
};

export const clampPage = (page, pageCount) => {
  return Math.min(Math.max(page, 1), pageCount);
};

export const paginateCars = (cars, page, pageSize) => {
  const startIndex = (page - 1) * pageSize;

  return cars.slice(startIndex, startIndex + pageSize);
};
