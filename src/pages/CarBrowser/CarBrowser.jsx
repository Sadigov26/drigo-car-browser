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

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]);



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
        />
        <p className={styles.counter}>
          AVAILABLE  {filteredCars.length} of {cars.length} CARS
        </p>
        <CarGrid cars={filteredCars} />
      </div>
    </div>
  );
};

export default CarBrowser;
