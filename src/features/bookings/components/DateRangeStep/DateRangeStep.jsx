import { MIN_RENTAL_DAYS } from "../../constants/bookingOptions";
import styles from "./DateRangeStep.module.css";

const DateRangeStep = ({
  endDate,
  errors,
  onChange,
  price,
  startDate,
  today,
}) => {
  return (
    <div className={styles.stepContent}>
      <div className={styles.intro}>
        <h3>Choose your rental dates</h3>
        <p>Rentals must be at least {MIN_RENTAL_DAYS} days.</p>
      </div>

      <div className={styles.dateFields}>
        <div className={styles.field}>
          <label htmlFor="booking-start-date">Start date</label>
          <input
            id="booking-start-date"
            name="startDate"
            type="date"
            min={today}
            value={startDate}
            onChange={onChange}
          />
          {errors.startDate && (
            <span className={styles.error}>{errors.startDate}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="booking-end-date">End date</label>
          <input
            id="booking-end-date"
            name="endDate"
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={onChange}
          />
          {errors.endDate && (
            <span className={styles.error}>{errors.endDate}</span>
          )}
        </div>
      </div>

      <div className={styles.pricePreview}>
        <span>Estimated total</span>
        <strong>{price.days ? `$${price.total}` : "Choose dates"}</strong>
        {price.days > 0 && <small>{price.days} rental days</small>}
      </div>
    </div>
  );
};

export default DateRangeStep;
