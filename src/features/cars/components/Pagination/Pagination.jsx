import styles from "./Pagination.module.css";

const Pagination = ({ currentPage, pageCount, onPageChange }) => {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav className={styles.pagination} aria-label="Car results pages">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      <div className={styles.pages}>
        {Array.from({ length: pageCount }, (_, index) => {
          const page = index + 1;

          return (
            <button
              className={page === currentPage ? styles.activePage : ""}
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
