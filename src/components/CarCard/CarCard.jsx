import styles from "./CarCard.module.css";

function CarCard({ car, className = "" }) {
  const badgeClassName = car.available
    ? `${styles.badge} ${styles.badgeAvailable}`
    : `${styles.badge} ${styles.badgeUnavailable}`;

  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.cardTop}>
        <h2 className={styles.title}>{car.name}</h2>
        <span className={badgeClassName}>
          {car.available ? "For Rent" : "Rented"}
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
    </div>
  );
}

export default CarCard;
