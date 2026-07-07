import { useEffect, useMemo, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import FeedbackMessage from "../../components/feedback/FeedbackMessage/FeedbackMessage";
import Footer from "../../components/layout/Footer/Footer";
import Header from "../../components/layout/Header/Header";
import CarGrid from "../../features/cars/components/CarGrid/CarGrid";
import Pagination from "../../features/cars/components/Pagination/Pagination";
import SearchBox from "../../features/cars/components/SearchBox/SearchBox";
import { PAGE_SIZE } from "../../features/cars/constants/carOptions";
import { useCars } from "../../features/cars/hooks/useCars";
import { useDebounce } from "../../features/cars/hooks/useDebounce";
import { useFavorites } from "../../features/cars/hooks/useFavorites";
import {
  carFiltersReducer,
  createInitialFilters,
} from "../../features/cars/reducers/carFiltersReducer";
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
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlValues = getFilterValuesFromUrl(searchParams);
  const [filters, dispatch] = useReducer(
    carFiltersReducer,
    urlValues,
    createInitialFilters,
  );

  const debouncedSearchText = useDebounce(filters.search, 300);
  const debouncedMinPrice = useDebounce(filters.minPrice, 300);
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 300);

  const visibleState = useMemo(() => {
    const filteredCars = filterCars(cars, {
      search: debouncedSearchText,
      transmission: filters.transmission,
      types: filters.types,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      seats: filters.seats,
      available: filters.available,
      favoritesOnly: filters.favoritesOnly,
      favoriteIds,
    });

    const sortedCars = sortCars(filteredCars, filters.sort);
    const pageCount = getPageCount(sortedCars.length, PAGE_SIZE);
    const safePage = clampPage(filters.page, pageCount);
    const visibleCars = paginateCars(sortedCars, safePage, PAGE_SIZE);

    return {
      pageCount,
      safePage,
      sortedCars,
      visibleCars,
    };
  }, [
    cars,
    debouncedSearchText,
    filters.transmission,
    filters.types,
    debouncedMinPrice,
    debouncedMaxPrice,
    filters.seats,
    filters.available,
    filters.favoritesOnly,
    filters.sort,
    filters.page,
    favoriteIds,
  ]);

  useEffect(() => {
    const nextParams = buildFilterSearchParams({
      search: debouncedSearchText,
      transmission: filters.transmission,
      types: filters.types,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      seats: filters.seats,
      available: filters.available,
      favoritesOnly: filters.favoritesOnly,
      sort: filters.sort,
      page: visibleState.safePage,
    });

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [
    debouncedSearchText,
    filters.transmission,
    filters.types,
    debouncedMinPrice,
    debouncedMaxPrice,
    filters.seats,
    filters.available,
    filters.favoritesOnly,
    filters.sort,
    visibleState.safePage,
    searchParams,
    setSearchParams,
  ]);

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
              searchText={filters.search}
              onSearchChange={(value) => dispatch({ type: "setSearch", value })}
              transmissionFilter={filters.transmission}
              onTransmissionChange={(value) =>
                dispatch({ type: "setTransmission", value })
              }
              typeFilters={filters.types}
              onTypeChange={(value) => dispatch({ type: "setTypes", value })}
              minPrice={filters.minPrice}
              onMinPriceChange={(value) =>
                dispatch({ type: "setMinPrice", value })
              }
              maxPrice={filters.maxPrice}
              onMaxPriceChange={(value) =>
                dispatch({ type: "setMaxPrice", value })
              }
              seatsFilter={filters.seats}
              onSeatsChange={(value) => dispatch({ type: "setSeats", value })}
              availableOnly={filters.available}
              onAvailableChange={(value) =>
                dispatch({ type: "setAvailable", value })
              }
              favoritesOnly={filters.favoritesOnly}
              onFavoritesOnlyChange={(value) =>
                dispatch({ type: "setFavoritesOnly", value })
              }
              sortOrder={filters.sort}
              onSortChange={(value) => dispatch({ type: "setSort", value })}
            />

            <p className={styles.counter}>
              Showing {visibleState.visibleCars.length} of{" "}
              {visibleState.sortedCars.length} cars
            </p>

            {visibleState.sortedCars.length > 0 ? (
              <>
                <CarGrid
                  cars={visibleState.visibleCars}
                  isFavorite={isFavorite}
                  onFavoriteToggle={toggleFavorite}
                />
                <Pagination
                  currentPage={visibleState.safePage}
                  pageCount={visibleState.pageCount}
                  onPageChange={(value) => dispatch({ type: "setPage", value })}
                />
              </>
            ) : (
              <FeedbackMessage
                message="No cars match your search and filters."
                actionLabel="Reset filters"
                onAction={() => dispatch({ type: "reset" })}
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
