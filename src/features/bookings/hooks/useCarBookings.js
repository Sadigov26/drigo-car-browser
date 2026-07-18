import { useCallback, useEffect, useState } from "react";
import { getBookings } from "../../../api/mockApi";
import { getBookingsForCar } from "../utils/bookingAvailability";

export const useCarBookings = (carId) => {
  const [bookingState, setBookingState] = useState({
    bookings: [],
    carId: null,
    error: null,
    requestKey: null,
  });
  const [requestNumber, setRequestNumber] = useState(0);
  const currentRequestKey = `${carId}:${requestNumber}`;
  const stateMatchesCar = bookingState.carId === String(carId);
  const bookings = stateMatchesCar ? bookingState.bookings : [];
  const requestFinished = bookingState.requestKey === currentRequestKey;

  useEffect(() => {
    let ignoreResult = false;
    const requestKey = `${carId}:${requestNumber}`;

    getBookings()
      .then((allBookings) => {
        if (!ignoreResult) {
          setBookingState({
            bookings: getBookingsForCar(allBookings, carId),
            carId: String(carId),
            error: null,
            requestKey,
          });
        }
      })
      .catch((requestError) => {
        if (!ignoreResult) {
          setBookingState({
            bookings: [],
            carId: String(carId),
            error: requestError,
            requestKey,
          });
        }
      });

    return () => {
      ignoreResult = true;
    };
  }, [carId, requestNumber]);

  const retry = useCallback(() => {
    setRequestNumber((currentNumber) => currentNumber + 1);
  }, []);

  const addOptimisticBooking = useCallback((booking) => {
    setBookingState((currentState) => ({
      ...currentState,
      bookings: getBookingsForCar(
        [...currentState.bookings, booking],
        booking.carId,
      ),
    }));
  }, []);

  const replaceBooking = useCallback((temporaryId, savedBooking) => {
    setBookingState((currentState) => ({
      ...currentState,
      bookings: getBookingsForCar(
        currentState.bookings.map((booking) =>
          booking.id === temporaryId ? savedBooking : booking,
        ),
        savedBooking.carId,
      ),
    }));
  }, []);

  const removeBooking = useCallback((bookingId) => {
    setBookingState((currentState) => ({
      ...currentState,
      bookings: currentState.bookings.filter(
        (booking) => booking.id !== bookingId,
      ),
    }));
  }, []);

  return {
    addOptimisticBooking,
    bookings,
    error: requestFinished ? bookingState.error : null,
    loading: !requestFinished,
    removeBooking,
    replaceBooking,
    retry,
  };
};
