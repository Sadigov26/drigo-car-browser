export const filterCars = (cars, filters) => {
  return cars.filter((car) => {
    const matchesSearch = car.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesTransmission =
      filters.transmission === "All" ||
      car.transmission === filters.transmission;

    const matchesType = filters.type === "All" || car.type === filters.type;
    const matchesAvailability = !filters.available || car.available;

    return (
      matchesSearch && matchesTransmission && matchesType && matchesAvailability
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
