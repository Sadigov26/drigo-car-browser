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

    return (
      matchesSearch &&
      matchesTransmission &&
      matchesType &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesSeats &&
      matchesAvailability
    );
  });
};

export const sortCars = (cars, sortOrder) => {
  return [...cars].sort((firstCar, secondCar) => {
    if (sortOrder === "highToLow") {
      return secondCar.pricePerDay - firstCar.pricePerDay;
    }

    return firstCar.pricePerDay - secondCar.pricePerDay;
  });
};
