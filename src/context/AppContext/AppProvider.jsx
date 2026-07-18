import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  cancelBooking as cancelBookingRequest,
  createBooking as createBookingRequest,
  getBookings,
} from "../../api/mockApi";
import { appReducer, createInitialAppState } from "./appReducer";
import AppContext from "./appContext";

export const USER_STORAGE_KEY = "drigo-user";

let nextToastNumber = 1;

const readSavedUser = () => {
  try {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    appReducer,
    undefined,
    () => createInitialAppState(readSavedUser()),
  );
  const mutationVersion = useRef(0);

  useEffect(() => {
    if (!state.user) {
      return undefined;
    }

    let ignoreResult = false;
    const requestMutationVersion = mutationVersion.current;

    getBookings(state.user)
      .then((bookings) => {
        if (
          !ignoreResult &&
          requestMutationVersion === mutationVersion.current
        ) {
          dispatch({ type: "bookingsLoaded", bookings });
        }
      })
      .catch((error) => {
        if (
          !ignoreResult &&
          requestMutationVersion === mutationVersion.current
        ) {
          dispatch({ type: "bookingsFailed", error });
        }
      });

    return () => {
      ignoreResult = true;
    };
  }, [state.bookingsReloadNumber, state.user]);

  const addToast = useCallback((message, tone = "success") => {
    const toast = {
      id: `toast-${nextToastNumber}`,
      message,
      tone,
    };

    nextToastNumber += 1;
    dispatch({ type: "toastAdded", toast });
  }, []);

  const removeToast = useCallback((toastId) => {
    dispatch({ type: "toastRemoved", toastId });
  }, []);

  const signIn = useCallback(
    (user) => {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      mutationVersion.current += 1;
      dispatch({ type: "signIn", user });
      addToast(`Welcome, ${user.name}.`);
    },
    [addToast],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    mutationVersion.current += 1;
    dispatch({ type: "signOut" });
  }, []);

  const retryBookings = useCallback(() => {
    dispatch({ type: "retryBookings" });
  }, []);

  const createBooking = useCallback(
    async (bookingData, car) => {
      const optimisticBooking = {
        ...bookingData,
        id: `temporary-${Date.now()}`,
        car: { ...car },
      };

      mutationVersion.current += 1;
      dispatch({ type: "bookingAdded", booking: optimisticBooking });

      try {
        const savedBooking = await createBookingRequest(bookingData);

        dispatch({
          type: "bookingReplaced",
          temporaryId: optimisticBooking.id,
          booking: savedBooking,
        });
        addToast("Booking created successfully.");
        return savedBooking;
      } catch (error) {
        dispatch({
          type: "bookingRemoved",
          bookingId: optimisticBooking.id,
        });
        addToast(error.message, "error");
        throw error;
      }
    },
    [addToast],
  );

  const cancelBooking = useCallback(
    async (bookingId) => {
      const previousBookings = state.bookings;

      mutationVersion.current += 1;
      dispatch({ type: "bookingRemoved", bookingId });

      try {
        const cancelledBooking = await cancelBookingRequest(bookingId);

        addToast("Booking cancelled.");
        return cancelledBooking;
      } catch (error) {
        dispatch({ type: "bookingsRestored", bookings: previousBookings });
        addToast(`${error.message} The booking was restored.`, "error");
        throw error;
      }
    },
    [addToast, state.bookings],
  );

  const contextValue = useMemo(
    () => ({
      addToast,
      bookings: state.bookings,
      bookingsError: state.bookingsError,
      bookingsLoading: state.bookingsStatus === "loading",
      cancelBooking,
      createBooking,
      removeToast,
      retryBookings,
      signIn,
      signOut,
      toasts: state.toasts,
      user: state.user,
    }),
    [
      addToast,
      cancelBooking,
      createBooking,
      removeToast,
      retryBookings,
      signIn,
      signOut,
      state.bookings,
      state.bookingsError,
      state.bookingsStatus,
      state.toasts,
      state.user,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;
