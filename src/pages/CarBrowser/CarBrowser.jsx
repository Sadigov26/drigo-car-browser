import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import CarGrid from "../../components/CarGrid/CarGrid";
import SearchBox from "../../components/SearchBox/SearchBox";
import cars from "../../data/cars.json";
import styles from "./CarBrowser.module.css";

const CarBrowser = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]);

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(debouncedSearchText.toLowerCase()),
  );

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.searchContainer}>
        <SearchBox searchText={searchText} onSearchChange={setSearchText} />
        <p className={styles.counter}>
          AVAILABLE  {filteredCars.length} OF {cars.length} CARS
        </p>
        <CarGrid cars={filteredCars} />
      </div>
    </div>
  );
};

export default CarBrowser;
