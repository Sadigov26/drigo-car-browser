import styles from "./SearchBox.module.css";

const SearchBox = ({
  searchText,
  onSearchChange,
  transmissionFilter,
  onTransmissionChange,
  typeFilter,
  onTypeChange,
  availableOnly,
  onAvailableChange,
  sortOrder,
  onSortChange,
}) => {
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

        <div className={styles.field}>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={typeFilter}
            onChange={(event) => onTypeChange(event.target.value)}
          >
            <option value="All">All</option>
            <option value="Economy">Economy</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Luxury">Luxury</option>
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
