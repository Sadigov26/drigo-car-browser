import { Link, useLocation } from "react-router-dom";
import styles from "./CarCard.module.css";

function CarCard({ car, className = "" }) {
  const location = useLocation();
  const badgeClassName = car.available
    ? `${styles.badge} ${styles.badgeAvailable}`
    : `${styles.badge} ${styles.badgeUnavailable}`;

  return (
    <Link
      className={`${styles.card} ${className}`}
      to={`/cars/${car.id}`}
      state={{ from: `${location.pathname}${location.search}` }}
    >
      <div className={styles.cardTop}>
        <div>
          <p className={styles.type}>{car.type}</p>
          <h2 className={styles.title}>{car.name}</h2>
        </div>
        <span className={badgeClassName}>
          {car.available ? "Available" : "Unavailable"}
        </span>
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
    </Link>
  );
}

export default CarCard;
