import { useLocation, useNavigate } from "react-router-dom";
import styles from "./CarCard.module.css";

function CarCard({ car, className = "", isFavorite, onFavoriteToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const badgeClassName = car.available
    ? `${styles.badge} ${styles.badgeAvailable}`
    : `${styles.badge} ${styles.badgeUnavailable}`;
  const detailPath = `/cars/${car.id}`;
  const listPath = `${location.pathname}${location.search}`;

  const openCarDetail = () => {
    navigate(detailPath, { state: { from: listPath } });
  };

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    onFavoriteToggle(car.id);
  };

  return (
    <article className={`${styles.card} ${className}`} onClick={openCarDetail}>
      <div className={styles.cardTop}>
        <div>
          <p className={styles.type}>{car.type}</p>
          <h2 className={styles.title}>{car.name}</h2>
        </div>

        <div className={styles.cardStatus}>
          <span className={badgeClassName}>
            {car.available ? "Available" : "Unavailable"}
          </span>
          <button
            className={
              isFavorite
                ? `${styles.favoriteButton} ${styles.favoriteButtonActive}`
                : styles.favoriteButton
            }
            type="button"
            onClick={handleFavoriteClick}
          >
            <span>{isFavorite ? "\u2605" : "\u2606"}</span>
          </button>
        </div>
      </div>

      <div className={styles.details}>
        <p>
          <strong>Type:</strong> {car.type}
        </p>
        <p>
          <strong>Transmission:</strong> {car.transmission}
        </p>
        <p>
          <strong>Seats:</strong> {car.seats}
        </p>
        <p>
          <strong>Price/day:</strong> ${car.pricePerDay}
        </p>
      </div>
    </article>
  );
}

export default CarCard;
