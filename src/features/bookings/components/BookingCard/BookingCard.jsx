import { formatBookingDate } from "../../utils/bookingAvailability";
import styles from "./BookingCard.module.css";

const BookingCard = ({ booking, canCancel, onCancel }) => {
  return (
    <article className={styles.card}>
      <div className={styles.heading}>
        <div>
          <p>Booking {booking.id}</p>
          <h3>{booking.carName}</h3>
        </div>
        {booking.status && <span>{booking.status}</span>}
      </div>

      <dl className={styles.details}>
        <div>
          <dt>Rental dates</dt>
          <dd>
            {formatBookingDate(booking.startDate)} - {" "}
            {formatBookingDate(booking.endDate)}
          </dd>
        </div>
        <div>
          <dt>Driver</dt>
          <dd>{booking.driver}</dd>
        </div>
        {booking.totalPrice && (
          <div>
            <dt>Total</dt>
            <dd>${booking.totalPrice}</dd>
          </div>
        )}
      </dl>

      {canCancel && (
        <button
          className={styles.cancelButton}
          type="button"
          onClick={() => onCancel(booking)}
        >
          Cancel
        </button>
      )}
    </article>
  );
};

export default BookingCard;
