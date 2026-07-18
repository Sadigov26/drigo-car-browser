import { useMemo, useReducer } from "react";
import { createBooking } from "../../../../api/mockApi";
import { BOOKING_STEPS } from "../../constants/bookingOptions";
import { useCarBookings } from "../../hooks/useCarBookings";
import {
  bookingWizardReducer,
  createInitialBookingState,
} from "../../reducers/bookingWizardReducer";
import {
  calculateBookingPrice,
  getTodayDateString,
  hasValidationErrors,
  validateDateRange,
  validateDriverDetails,
} from "../../utils/bookingValidation";
import { findOverlappingBooking } from "../../utils/bookingAvailability";
import BookingReviewStep from "../BookingReviewStep/BookingReviewStep";
import DateRangeStep from "../DateRangeStep/DateRangeStep";
import DriverDetailsStep from "../DriverDetailsStep/DriverDetailsStep";
import styles from "./BookingWizard.module.css";

const dateFields = { startDate: true, endDate: true };
const driverFields = {
  fullName: true,
  email: true,
  licenseNumber: true,
};

const getVisibleErrors = (errors, touched) => {
  return Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field]),
  );
};

const BookingWizard = ({ car, onBookingCreated, user }) => {
  const [state, dispatch] = useReducer(
    bookingWizardReducer,
    user,
    createInitialBookingState,
  );
  const {
    addOptimisticBooking,
    bookings,
    error: availabilityError,
    loading: availabilityLoading,
    removeBooking,
    replaceBooking,
    retry: retryAvailability,
  } = useCarBookings(car.id);
  const today = getTodayDateString();
  const dateErrors = useMemo(
    () => {
      const errors = validateDateRange(
        { startDate: state.startDate, endDate: state.endDate },
        today,
      );
      const overlappingBooking = findOverlappingBooking(bookings, {
        carId: car.id,
        startDate: state.startDate,
        endDate: state.endDate,
      });

      if (overlappingBooking) {
        errors.endDate = `These dates overlap a booking from ${overlappingBooking.startDate} to ${overlappingBooking.endDate}.`;
      }

      return errors;
    },
    [bookings, car.id, state.startDate, state.endDate, today],
  );
  const driverErrors = useMemo(
    () => validateDriverDetails(state.driver),
    [state.driver],
  );
  const price = useMemo(
    () =>
      calculateBookingPrice(
        state.startDate,
        state.endDate,
        car.pricePerDay,
      ),
    [car.pricePerDay, state.endDate, state.startDate],
  );
  const bookingIsValid =
    !hasValidationErrors(dateErrors) &&
    !hasValidationErrors(driverErrors) &&
    !availabilityLoading &&
    !availabilityError &&
    price.days > 0;

  const handleDateChange = (event) => {
    dispatch({
      type: "changeDate",
      name: event.target.name,
      value: event.target.value,
    });
  };

  const handleDriverChange = (event) => {
    dispatch({
      type: "changeDriver",
      name: event.target.name,
      value: event.target.value,
    });
  };

  const handleContinue = () => {
    if (state.step === BOOKING_STEPS.DATES) {
      if (availabilityLoading || availabilityError) {
        return;
      }

      dispatch({ type: "touchFields", fields: dateFields });

      if (!hasValidationErrors(dateErrors)) {
        dispatch({ type: "nextStep" });
      }

      return;
    }

    dispatch({ type: "touchFields", fields: driverFields });

    if (!hasValidationErrors(driverErrors)) {
      dispatch({ type: "nextStep" });
    }
  };

  const handleSubmit = async () => {
    if (!bookingIsValid || state.submitting) {
      return;
    }

    const bookingData = {
      carId: car.id,
      carName: car.name,
      startDate: state.startDate,
      endDate: state.endDate,
      driver: state.driver.fullName,
      driverDetails: { ...state.driver },
      userEmail: user?.email || state.driver.email,
      days: price.days,
      rentalCost: price.rentalCost,
      serviceFee: price.serviceFee,
      totalPrice: price.total,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };
    const optimisticBooking = {
      ...bookingData,
      id: `temporary-${Date.now()}`,
      car: { ...car },
    };

    addOptimisticBooking(optimisticBooking);
    dispatch({ type: "submitStart", booking: optimisticBooking });

    try {
      const savedBooking = await createBooking(bookingData);

      replaceBooking(optimisticBooking.id, savedBooking);
      dispatch({ type: "submitSuccess", booking: savedBooking });
      onBookingCreated?.(savedBooking);
    } catch (error) {
      removeBooking(optimisticBooking.id);
      dispatch({ type: "submitError", message: error.message });
    }
  };

  if (!car.available) {
    return (
      <section className={styles.wizard}>
        <h2>Book this car</h2>
        <p className={styles.unavailableMessage}>
          This car is currently unavailable for booking.
        </p>
      </section>
    );
  }

  if (state.booking) {
    return (
      <section className={styles.wizard}>
        <div className={styles.successMessage}>
          <span className={styles.successMark}>OK</span>
          <div>
            <h2>Booking confirmed</h2>
            <p>{car.name} is booked from {state.startDate} to {state.endDate}.</p>
            {state.submitting ? (
              <small>Saving booking...</small>
            ) : (
              <small>Booking ID: {state.booking.id}</small>
            )}
          </div>
        </div>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={() => dispatch({ type: "restart", user })}
          disabled={state.submitting}
        >
          Book another date
        </button>
      </section>
    );
  }

  return (
    <section className={styles.wizard}>
      <div className={styles.wizardHeading}>
        <div>
          <p>Reservation</p>
          <h2>Book this car</h2>
        </div>
        <span>Step {state.step} of 3</span>
      </div>

      <ol className={styles.steps}>
        <li className={state.step >= 1 ? styles.activeStep : ""}>Dates</li>
        <li className={state.step >= 2 ? styles.activeStep : ""}>Driver</li>
        <li className={state.step >= 3 ? styles.activeStep : ""}>Review</li>
      </ol>

      {state.step === BOOKING_STEPS.DATES && (
        <DateRangeStep
          availabilityError={availabilityError}
          availabilityLoading={availabilityLoading}
          bookings={bookings}
          startDate={state.startDate}
          endDate={state.endDate}
          today={today}
          price={price}
          errors={getVisibleErrors(dateErrors, state.touched)}
          onChange={handleDateChange}
          onRetryAvailability={retryAvailability}
        />
      )}

      {state.step === BOOKING_STEPS.DRIVER && (
        <DriverDetailsStep
          driver={state.driver}
          errors={getVisibleErrors(driverErrors, state.touched)}
          onChange={handleDriverChange}
        />
      )}

      {state.step === BOOKING_STEPS.REVIEW && (
        <BookingReviewStep
          car={car}
          driver={state.driver}
          startDate={state.startDate}
          endDate={state.endDate}
          price={price}
        />
      )}

      {state.submitError && (
        <div className={styles.submitError}>{state.submitError}</div>
      )}

      <div className={styles.actions}>
        {state.step > BOOKING_STEPS.DATES && (
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => dispatch({ type: "previousStep" })}
            disabled={state.submitting}
          >
            Back
          </button>
        )}

        {state.step < BOOKING_STEPS.REVIEW ? (
          <button
            className={styles.primaryButton}
            type="button"
            onClick={handleContinue}
            disabled={
              state.step === BOOKING_STEPS.DATES &&
              (availabilityLoading || Boolean(availabilityError))
            }
          >
            Continue
          </button>
        ) : (
          <button
            className={styles.primaryButton}
            type="button"
            onClick={handleSubmit}
            disabled={!bookingIsValid || state.submitting}
          >
            {state.submitting ? "Confirming..." : "Confirm booking"}
          </button>
        )}
      </div>
    </section>
  );
};

export default BookingWizard;
