import { MIN_RENTAL_DAYS } from "../../constants/bookingOptions";
import { formatBookingDate } from "../../utils/bookingAvailability";
import styles from "./DateRangeStep.module.css";

const DateRangeStep = ({
  availabilityError,
  availabilityLoading,
  bookings,
  endDate,
  errors,
  onChange,
  onRetryAvailability,
  price,
  startDate,
  today,
}) => {
  return (
    <div
      className={styles.stepContent}
      role="group"
      aria-labelledby="booking-dates-heading"
      aria-describedby="booking-dates-help"
    >
      <div className={styles.intro}>
        <h3 id="booking-dates-heading" tabIndex="-1" data-booking-focus>
          Choose your rental dates
        </h3>
        <p id="booking-dates-help">
          Rentals must be at least {MIN_RENTAL_DAYS} days.
        </p>
      </div>

      <div className={styles.availability} aria-live="polite">
        <strong>Booked dates</strong>
        {availabilityLoading ? (
          <p>Checking availability...</p>
        ) : availabilityError ? (
          <div className={styles.availabilityError}>
            <span>Could not check booked dates.</span>
            <button type="button" onClick={onRetryAvailability}>
              Retry
            </button>
          </div>
        ) : bookings.length ? (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id}>
                {formatBookingDate(booking.startDate)} - {" "}
                {formatBookingDate(booking.endDate)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reserved dates for this car.</p>
        )}
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
            aria-invalid={Boolean(errors.startDate)}
            aria-describedby={
              errors.startDate
                ? "booking-start-error booking-dates-help"
                : "booking-dates-help"
            }
          />
          {errors.startDate && (
            <span id="booking-start-error" className={styles.error}>
              {errors.startDate}
            </span>
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
            aria-invalid={Boolean(errors.endDate)}
            aria-describedby={
              errors.endDate
                ? "booking-end-error booking-dates-help"
                : "booking-dates-help"
            }
          />
          {errors.endDate && (
            <span id="booking-end-error" className={styles.error}>
              {errors.endDate}
            </span>
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
