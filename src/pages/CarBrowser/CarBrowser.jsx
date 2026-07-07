import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import CarGrid from "../../components/CarGrid/CarGrid";
import FeedbackMessage from "../../components/FeedbackMessage/FeedbackMessage";
import Footer from "../../components/Footer/Footer";
import SearchBox from "../../components/SearchBox/SearchBox";
import { DEFAULT_FILTERS } from "../../constants/carOptions";
import { useCars } from "../../hooks/useCars";
import { filterCars, sortCars } from "../../utils/carList";
import {
  buildFilterSearchParams,
  getFilterValuesFromUrl,
} from "../../utils/urlFilters";
import styles from "./CarBrowser.module.css";

const CarBrowser = () => {
  const { data: cars, error, loading, retry } = useCars();
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
    const nextParams = buildFilterSearchParams({
      search: debouncedSearchText,
      transmission: transmissionFilter,
      type: typeFilter,
      available: availableOnly,
      sort: sortOrder,
    });

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
    setSearchText(DEFAULT_FILTERS.search);
    setDebouncedSearchText(DEFAULT_FILTERS.search);
    setTransmissionFilter(DEFAULT_FILTERS.transmission);
    setTypeFilter(DEFAULT_FILTERS.type);
    setAvailableOnly(DEFAULT_FILTERS.available);
    setSortOrder(DEFAULT_FILTERS.sort);
  };

  const filteredCars = filterCars(cars, {
    search: debouncedSearchText,
    transmission: transmissionFilter,
    type: typeFilter,
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
