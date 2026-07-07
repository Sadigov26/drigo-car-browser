import { SEAT_OPTIONS, TYPE_OPTIONS } from "../../constants/carOptions";
import styles from "./SearchBox.module.css";

const SearchBox = ({
  searchText,
  onSearchChange,
  transmissionFilter,
  onTransmissionChange,
  typeFilters,
  onTypeChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  seatsFilter,
  onSeatsChange,
  availableOnly,
  onAvailableChange,
  sortOrder,
  onSortChange,
}) => {
  const handleTypeChange = (type) => {
    if (typeFilters.includes(type)) {
      onTypeChange(typeFilters.filter((selectedType) => selectedType !== type));
      return;
    }

    onTypeChange([...typeFilters, type]);
  };

  return (
    <div className={styles.searchBox}>
      <div className={`${styles.field} ${styles.searchField}`}>
        <label htmlFor="search">Search by car name</label>
        <input
          id="search"
          type="text"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Example: Toyota"
        />
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.field}>
          <label htmlFor="transmission">Transmission</label>
          <select
            id="transmission"
            value={transmissionFilter}
            onChange={(event) => onTransmissionChange(event.target.value)}
          >
            <option value="All">All</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div className={`${styles.field} ${styles.typeField}`}>
          <span className={styles.fieldLabel}>Type</span>
          <div className={styles.typeOptions}>
            {TYPE_OPTIONS.filter((type) => type !== "All").map((type) => (
              <label className={styles.smallCheckbox} key={type}>
                <input
                  type="checkbox"
                  checked={typeFilters.includes(type)}
                  onChange={() => handleTypeChange(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.priceFields}>
          <div className={styles.field}>
            <label htmlFor="minPrice">Min price</label>
            <input
              id="minPrice"
              min="0"
              type="number"
              value={minPrice}
              onChange={(event) => onMinPriceChange(event.target.value)}
              placeholder="$0"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="maxPrice">Max price</label>
            <input
              id="maxPrice"
              min="0"
              type="number"
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              placeholder="$200"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="seats">Seats</label>
          <select
            id="seats"
            value={seatsFilter}
            onChange={(event) => onSeatsChange(event.target.value)}
          >
            {SEAT_OPTIONS.map((seats) => (
              <option key={seats} value={seats}>
                {seats === "All" ? "All" : `${seats} seats`}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="sort">Sort by price</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => onAvailableChange(event.target.checked)}
          />
          Available only
        </label>
      </div>
    </div>
  );
};

export default SearchBox;
