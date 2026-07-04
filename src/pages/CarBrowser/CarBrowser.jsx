import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import CarGrid from "../../components/CarGrid/CarGrid";
import Footer from "../../components/Footer/Footer";
import SearchBox from "../../components/SearchBox/SearchBox";
import cars from "../../data/cars.json";
import styles from "./CarBrowser.module.css";

const transmissionOptions = ["All", "Automatic", "Manual"];
const typeOptions = ["All", "Economy", "Sedan", "SUV", "Luxury"];
const sortOptions = ["lowToHigh", "highToLow"];

const getFilterValuesFromUrl = (searchParams) => {
  const search = searchParams.get("search") || "";
  const transmission = searchParams.get("transmission") || "All";
  const type = searchParams.get("type") || "All";
  const available = searchParams.get("available") === "true";
  const sort = searchParams.get("sort") || "lowToHigh";

  return {
    search,
    transmission: transmissionOptions.includes(transmission)
      ? transmission
      : "All",
    type: typeOptions.includes(type) ? type : "All",
    available,
    sort: sortOptions.includes(sort) ? sort : "lowToHigh",
  };
};

const CarBrowser = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlValues = getFilterValuesFromUrl(searchParams);

  const [searchText, setSearchText] = useState(urlValues.search);
  const [debouncedSearchText, setDebouncedSearchText] = useState(
    urlValues.search,
  );
  const [transmissionFilter, setTransmissionFilter] = useState(
    urlValues.transmission,
  );
  const [typeFilter, setTypeFilter] = useState(urlValues.type);
  const [availableOnly, setAvailableOnly] = useState(urlValues.available);
  const [sortOrder, setSortOrder] = useState(urlValues.sort);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]);

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (debouncedSearchText) {
      nextParams.set("search", debouncedSearchText);
    }

    if (transmissionFilter !== "All") {
      nextParams.set("transmission", transmissionFilter);
    }

    if (typeFilter !== "All") {
      nextParams.set("type", typeFilter);
    }

    if (availableOnly) {
      nextParams.set("available", "true");
    }

    if (sortOrder !== "lowToHigh") {
      nextParams.set("sort", sortOrder);
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [
    debouncedSearchText,
    transmissionFilter,
    typeFilter,
    availableOnly,
    sortOrder,
    searchParams,
    setSearchParams,
  ]);

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
      matchesSearch && matchesTransmission && matchesType && matchesAvailability
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
      <Footer />
    </div>
  );
};

export default CarBrowser;
