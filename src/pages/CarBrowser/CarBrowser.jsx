import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FeedbackMessage from "../../components/feedback/FeedbackMessage/FeedbackMessage";
import Footer from "../../components/layout/Footer/Footer";
import Header from "../../components/layout/Header/Header";
import CarGrid from "../../features/cars/components/CarGrid/CarGrid";
import SearchBox from "../../features/cars/components/SearchBox/SearchBox";
import { DEFAULT_FILTERS } from "../../features/cars/constants/carOptions";
import { useCars } from "../../features/cars/hooks/useCars";
import { useDebounce } from "../../features/cars/hooks/useDebounce";
import { filterCars, sortCars } from "../../features/cars/utils/carList";
import {
  buildFilterSearchParams,
  getFilterValuesFromUrl,
} from "../../features/cars/utils/urlFilters";
import styles from "./CarBrowser.module.css";

const CarBrowser = () => {
  const { data: cars, error, loading, retry } = useCars();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlValues = getFilterValuesFromUrl(searchParams);

  const [searchText, setSearchText] = useState(urlValues.search);
  const [transmissionFilter, setTransmissionFilter] = useState(
    urlValues.transmission,
  );
  const [typeFilters, setTypeFilters] = useState(urlValues.types);
  const [minPrice, setMinPrice] = useState(urlValues.minPrice);
  const [maxPrice, setMaxPrice] = useState(urlValues.maxPrice);
  const [seatsFilter, setSeatsFilter] = useState(urlValues.seats);
  const [availableOnly, setAvailableOnly] = useState(urlValues.available);
  const [sortOrder, setSortOrder] = useState(urlValues.sort);

  const debouncedSearchText = useDebounce(searchText, 300);
  const debouncedMinPrice = useDebounce(minPrice, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);

  useEffect(() => {
    const nextParams = buildFilterSearchParams({
      search: debouncedSearchText,
      transmission: transmissionFilter,
      types: typeFilters,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      seats: seatsFilter,
      available: availableOnly,
      sort: sortOrder,
    });

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [
    debouncedSearchText,
    transmissionFilter,
    typeFilters,
    debouncedMinPrice,
    debouncedMaxPrice,
    seatsFilter,
    availableOnly,
    sortOrder,
    searchParams,
    setSearchParams,
  ]);

  const resetFilters = () => {
    setSearchText(DEFAULT_FILTERS.search);
    setTransmissionFilter(DEFAULT_FILTERS.transmission);
    setTypeFilters(DEFAULT_FILTERS.types);
    setMinPrice(DEFAULT_FILTERS.minPrice);
    setMaxPrice(DEFAULT_FILTERS.maxPrice);
    setSeatsFilter(DEFAULT_FILTERS.seats);
    setAvailableOnly(DEFAULT_FILTERS.available);
    setSortOrder(DEFAULT_FILTERS.sort);
  };

  const filteredCars = filterCars(cars, {
    search: debouncedSearchText,
    transmission: transmissionFilter,
    types: typeFilters,
    minPrice: debouncedMinPrice,
    maxPrice: debouncedMaxPrice,
    seats: seatsFilter,
    available: availableOnly,
  });

  const sortedCars = sortCars(filteredCars, sortOrder);

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.searchContainer}>
        {loading ? (
          <FeedbackMessage message="Loading cars..." />
        ) : error ? (
          <FeedbackMessage
            tone="error"
            message={error.message}
            actionLabel="Retry"
            onAction={retry}
          />
        ) : (
          <>
            <SearchBox
              searchText={searchText}
              onSearchChange={setSearchText}
              transmissionFilter={transmissionFilter}
              onTransmissionChange={setTransmissionFilter}
              typeFilters={typeFilters}
              onTypeChange={setTypeFilters}
              minPrice={minPrice}
              onMinPriceChange={setMinPrice}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              seatsFilter={seatsFilter}
              onSeatsChange={setSeatsFilter}
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
              <FeedbackMessage
                message="No cars match your search and filters."
                actionLabel="Reset filters"
                onAction={resetFilters}
              />
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CarBrowser;
