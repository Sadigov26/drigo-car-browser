import { useCallback, useEffect, useState } from "react";
import {
  cancelBooking as cancelBookingRequest,
  getBookings,
} from "../../../api/mockApi";

export const useBookings = (user) => {
  const [bookingState, setBookingState] = useState({
    bookings: [],
    error: null,
    requestKey: null,
  });
  const [mutationError, setMutationError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [requestNumber, setRequestNumber] = useState(0);
  const userKey = JSON.stringify(user || null);
  const currentRequestKey = `${userKey}:${requestNumber}`;
  const requestFinished = bookingState.requestKey === currentRequestKey;
  const bookings = bookingState.bookings;

  useEffect(() => {
    let ignoreResult = false;
    const requestKey = `${userKey}:${requestNumber}`;
    const requestUser = JSON.parse(userKey);

    getBookings(requestUser)
      .then((loadedBookings) => {
        if (!ignoreResult) {
          setBookingState({
            bookings: loadedBookings,
            error: null,
            requestKey,
          });
        }
      })
      .catch((requestError) => {
        if (!ignoreResult) {
          setBookingState({
            bookings: [],
            error: requestError,
            requestKey,
          });
        }
      });

    return () => {
      ignoreResult = true;
    };
  }, [requestNumber, userKey]);

  const retry = useCallback(() => {
    setRequestNumber((currentNumber) => currentNumber + 1);
  }, []);

  const cancelBooking = useCallback(
    async (bookingId) => {
      if (cancellingId) {
        return false;
      }

      const previousBookings = bookings;

      setBookingState((currentState) => ({
        ...currentState,
        bookings: currentState.bookings.filter(
          (booking) => booking.id !== bookingId,
        ),
      }));
      setCancellingId(bookingId);
      setMutationError("");

      try {
        await cancelBookingRequest(bookingId);
        setCancellingId(null);
        return true;
      } catch (requestError) {
        setBookingState((currentState) => ({
          ...currentState,
          bookings: previousBookings,
        }));
        setCancellingId(null);
        setMutationError(
          `${requestError.message} The booking was restored.`,
        );
        return false;
      }
    },
    [bookings, cancellingId],
  );

  const dismissMutationError = useCallback(() => {
    setMutationError("");
  }, []);

  return {
    bookings,
    cancelBooking,
    cancellingId,
    dismissMutationError,
    error: requestFinished ? bookingState.error : null,
    loading: !requestFinished,
    mutationError,
    retry,
  };
};
