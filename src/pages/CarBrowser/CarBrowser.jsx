import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FeedbackMessage from "../../components/feedback/FeedbackMessage/FeedbackMessage";
import Footer from "../../components/layout/Footer/Footer";
import Header from "../../components/layout/Header/Header";
import CarGrid from "../../features/cars/components/CarGrid/CarGrid";
import Pagination from "../../features/cars/components/Pagination/Pagination";
import SearchBox from "../../features/cars/components/SearchBox/SearchBox";
import {
  DEFAULT_FILTERS,
  PAGE_SIZE,
} from "../../features/cars/constants/carOptions";
import { useCars } from "../../features/cars/hooks/useCars";
import { useDebounce } from "../../features/cars/hooks/useDebounce";
import {
  clampPage,
  filterCars,
  getPageCount,
  paginateCars,
  sortCars,
} from "../../features/cars/utils/carList";
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
  const [currentPage, setCurrentPage] = useState(urlValues.page);

  const debouncedSearchText = useDebounce(searchText, 300);
  const debouncedMinPrice = useDebounce(minPrice, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);

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
  const pageCount = getPageCount(sortedCars.length, PAGE_SIZE);
  const safePage = clampPage(currentPage, pageCount);
  const visibleCars = paginateCars(sortedCars, safePage, PAGE_SIZE);

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
      page: safePage,
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
    safePage,
    searchParams,
    setSearchParams,
  ]);

  const resetPage = () => {
    setCurrentPage(DEFAULT_FILTERS.page);
  };

  const changeSearchText = (value) => {
    setSearchText(value);
    resetPage();
  };

  const changeTransmissionFilter = (value) => {
    setTransmissionFilter(value);
    resetPage();
  };

  const changeTypeFilters = (value) => {
    setTypeFilters(value);
    resetPage();
  };

  const changeMinPrice = (value) => {
    setMinPrice(value);
    resetPage();
  };

  const changeMaxPrice = (value) => {
    setMaxPrice(value);
    resetPage();
  };

  const changeSeatsFilter = (value) => {
    setSeatsFilter(value);
    resetPage();
  };

  const changeAvailableOnly = (value) => {
    setAvailableOnly(value);
    resetPage();
  };

  const changeSortOrder = (value) => {
    setSortOrder(value);
    resetPage();
  };

  const resetFilters = () => {
    setSearchText(DEFAULT_FILTERS.search);
    setTransmissionFilter(DEFAULT_FILTERS.transmission);
    setTypeFilters(DEFAULT_FILTERS.types);
    setMinPrice(DEFAULT_FILTERS.minPrice);
    setMaxPrice(DEFAULT_FILTERS.maxPrice);
    setSeatsFilter(DEFAULT_FILTERS.seats);
    setAvailableOnly(DEFAULT_FILTERS.available);
    setSortOrder(DEFAULT_FILTERS.sort);
    setCurrentPage(DEFAULT_FILTERS.page);
  };

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
              onSearchChange={changeSearchText}
              transmissionFilter={transmissionFilter}
              onTransmissionChange={changeTransmissionFilter}
              typeFilters={typeFilters}
              onTypeChange={changeTypeFilters}
              minPrice={minPrice}
              onMinPriceChange={changeMinPrice}
              maxPrice={maxPrice}
              onMaxPriceChange={changeMaxPrice}
              seatsFilter={seatsFilter}
              onSeatsChange={changeSeatsFilter}
              availableOnly={availableOnly}
              onAvailableChange={changeAvailableOnly}
              sortOrder={sortOrder}
              onSortChange={changeSortOrder}
            />

            <p className={styles.counter}>
              Showing {visibleCars.length} of {sortedCars.length} cars
            </p>

            {sortedCars.length > 0 ? (
              <>
                <CarGrid cars={visibleCars} />
                <Pagination
                  currentPage={safePage}
                  pageCount={pageCount}
                  onPageChange={setCurrentPage}
                />
              </>
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
