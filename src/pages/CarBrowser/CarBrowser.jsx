import { useEffect, useMemo, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import FeedbackMessage from "../../components/feedback/FeedbackMessage/FeedbackMessage";
import Footer from "../../components/layout/Footer/Footer";
import Header from "../../components/layout/Header/Header";
import CarGrid from "../../features/cars/components/CarGrid/CarGrid";
import Pagination from "../../features/cars/components/Pagination/Pagination";
import SearchBox from "../../features/cars/components/SearchBox/SearchBox";
import { useCars } from "../../features/cars/hooks/useCars";
import { useDebounce } from "../../features/cars/hooks/useDebounce";
import { useFavorites } from "../../features/cars/hooks/useFavorites";
import {
  carFiltersReducer,
  createInitialFilters,
} from "../../features/cars/reducers/carFiltersReducer";
import {
  buildFilterSearchParams,
  getFilterValuesFromUrl,
} from "../../features/cars/utils/urlFilters";
import styles from "./CarBrowser.module.css";

const CarBrowser = () => {
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

  const carQuery = useMemo(
    () => ({
      search: debouncedSearchText,
      transmission: filters.transmission,
      types: filters.types,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      seats: filters.seats,
      available: filters.available,
      favoritesOnly: filters.favoritesOnly,
      favoriteIds,
      sort: filters.sort,
      page: filters.page,
    }),
    [
      debouncedSearchText,
      filters.transmission,
      filters.types,
      debouncedMinPrice,
      debouncedMaxPrice,
      filters.seats,
      filters.available,
      filters.favoritesOnly,
      favoriteIds,
      filters.sort,
      filters.page,
    ],
  );

  const {
    cars,
    error,
    hasData,
    loading,
    page,
    pageCount,
    retry,
    total,
    updating,
  } = useCars(carQuery);

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
      page: filters.page,
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
    filters.page,
    searchParams,
    setSearchParams,
  ]);

  useEffect(() => {
    if (!loading && !updating && !error && page !== filters.page) {
      dispatch({ type: "setPage", value: page });
    }
  }, [error, filters.page, loading, page, updating]);

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.searchContainer}>
        {error && hasData && (
          <div className={styles.refreshError}>
            <span>{error.message}</span>
            <button type="button" onClick={retry}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <FeedbackMessage message="Loading cars..." />
        ) : error && !hasData ? (
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

            <div className={styles.resultsRow}>
              <p className={styles.counter}>
                Showing {cars.length} of {total} cars
              </p>
              <div
                className={styles.updateStatus}
                role="status"
                aria-live="polite"
              >
                {updating && (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    <span>Updating</span>
                  </>
                )}
              </div>
            </div>

            {total > 0 ? (
              <>
                <CarGrid
                  cars={cars}
                  isFavorite={isFavorite}
                  onFavoriteToggle={toggleFavorite}
                />
                <Pagination
                  currentPage={page}
                  pageCount={pageCount}
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
