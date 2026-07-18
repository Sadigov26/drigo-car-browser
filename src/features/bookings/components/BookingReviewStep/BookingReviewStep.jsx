import styles from "./BookingReviewStep.module.css";

const BookingReviewStep = ({ car, driver, endDate, price, startDate }) => {
  return (
    <div className={styles.stepContent}>
      <div className={styles.intro}>
        <h3>Review your booking</h3>
        <p>Check the information before you confirm.</p>
      </div>

      <dl className={styles.reviewList}>
        <div>
          <dt>Car</dt>
          <dd>{car.name}</dd>
        </div>
        <div>
          <dt>Dates</dt>
          <dd>
            {startDate} to {endDate}
          </dd>
        </div>
        <div>
          <dt>Driver</dt>
          <dd>{driver.fullName}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{driver.email}</dd>
        </div>
        <div>
          <dt>License</dt>
          <dd>{driver.licenseNumber}</dd>
        </div>
      </dl>

      <div className={styles.priceLines}>
        <p>
          <span>
            {price.days} days x ${car.pricePerDay}
          </span>
          <strong>${price.rentalCost}</strong>
        </p>
        <p>
          <span>Service fee</span>
          <strong>${price.serviceFee}</strong>
        </p>
        <p className={styles.total}>
          <span>Total</span>
          <strong>${price.total}</strong>
        </p>
      </div>
    </div>
  );
};

export default BookingReviewStep;
