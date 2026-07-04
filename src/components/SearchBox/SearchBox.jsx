import styles from './SearchBox.module.css'

const SearchBox = ({ searchText, onSearchChange }) => {
  return (
    <div className={styles.searchBox}>
      <label htmlFor="search">Search by car name</label>
      <input
        id="search"
        type="text"
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Example: Toyota"
      />
    </div>
  )
}

export default SearchBox
