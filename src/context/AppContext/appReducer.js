export const createInitialAppState = (savedUser) => ({
  user: savedUser,
  bookings: [],
  bookingsStatus: savedUser ? "loading" : "idle",
  bookingsError: null,
  bookingsReloadNumber: 0,
  toasts: [],
});

export const appReducer = (state, action) => {
  switch (action.type) {
    case "signIn":
      return {
        ...state,
        user: action.user,
        bookings: [],
        bookingsStatus: "loading",
        bookingsError: null,
      };
    case "signOut":
      return {
        ...state,
        user: null,
        bookings: [],
        bookingsStatus: "idle",
        bookingsError: null,
      };
    case "bookingsLoaded":
      return {
        ...state,
        bookings: action.bookings,
        bookingsStatus: "success",
        bookingsError: null,
      };
    case "bookingsFailed":
      return {
        ...state,
        bookings: [],
        bookingsStatus: "error",
        bookingsError: action.error,
      };
    case "retryBookings":
      return {
        ...state,
        bookingsStatus: "loading",
        bookingsError: null,
        bookingsReloadNumber: state.bookingsReloadNumber + 1,
      };
    case "bookingAdded":
      return {
        ...state,
        bookings: [...state.bookings, action.booking],
        bookingsStatus: "success",
        bookingsError: null,
      };
    case "bookingReplaced":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.temporaryId ? action.booking : booking,
        ),
      };
    case "bookingRemoved":
      return {
        ...state,
        bookings: state.bookings.filter(
          (booking) => booking.id !== action.bookingId,
        ),
      };
    case "bookingsRestored":
      return {
        ...state,
        bookings: action.bookings,
      };
    case "toastAdded":
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case "toastRemoved":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };
    default:
      return state;
  }
};
