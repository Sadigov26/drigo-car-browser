import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import CarGrid from "../../components/CarGrid/CarGrid";
import SearchBox from "../../components/SearchBox/SearchBox";
import cars from "../../data/cars.json";
import styles from "./CarBrowser.module.css";

const CarBrowser = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("lowToHigh");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]);

  const resetFilters = () => {
    setSearchText("");
    setDebouncedSearchText("");
    setTransmissionFilter("All");
    setTypeFilter("All");
    setAvailableOnly(false);
    setSortOrder("lowToHigh");
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.name
      .toLowerCase()
      .includes(debouncedSearchText.toLowerCase());

    const matchesTransmission =
      transmissionFilter === "All" || car.transmission === transmissionFilter;

    const matchesType = typeFilter === "All" || car.type === typeFilter;
    const matchesAvailability = !availableOnly || car.available;

    return (
      matchesSearch &&
      matchesTransmission &&
      matchesType &&
      matchesAvailability
    );
  });

  const sortedCars = [...filteredCars].sort((firstCar, secondCar) => {
    if (sortOrder === "highToLow") {
      return secondCar.pricePerDay - firstCar.pricePerDay;
    }

    return firstCar.pricePerDay - secondCar.pricePerDay;
  });

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.searchContainer}>
        <SearchBox
          searchText={searchText}
          onSearchChange={setSearchText}
          transmissionFilter={transmissionFilter}
          onTransmissionChange={setTransmissionFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          availableOnly={availableOnly}
          onAvailableChange={setAvailableOnly}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        <p className={styles.counter}>
          Showing {sortedCars.length} of {cars.length} cars
        </p>

        {sortedCars.length > 0 ? (
          <CarGrid cars={sortedCars} />
        ) : (
          <div className={styles.emptyState}>
            <p>No cars match your search and filters.</p>
            <button type="button" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarBrowser;
