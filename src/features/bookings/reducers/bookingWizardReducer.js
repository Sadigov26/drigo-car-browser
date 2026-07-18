import { BOOKING_STEPS } from "../constants/bookingOptions";

export const createInitialBookingState = (user = {}) => ({
  step: BOOKING_STEPS.DATES,
  startDate: "",
  endDate: "",
  driver: {
    fullName: user.name || "",
    email: user.email || "",
    licenseNumber: "",
  },
  touched: {},
  submitting: false,
  submitError: "",
  booking: null,
});

export const bookingWizardReducer = (state, action) => {
  switch (action.type) {
    case "changeDate":
      return {
        ...state,
        [action.name]: action.value,
        submitError: "",
      };
    case "changeDriver":
      return {
        ...state,
        driver: {
          ...state.driver,
          [action.name]: action.value,
        },
        submitError: "",
      };
    case "touchFields":
      return {
        ...state,
        touched: {
          ...state.touched,
          ...action.fields,
        },
      };
    case "nextStep":
      return { ...state, step: state.step + 1 };
    case "previousStep":
      return { ...state, step: state.step - 1, submitError: "" };
    case "submitStart":
      return {
        ...state,
        submitting: true,
        submitError: "",
        booking: action.booking,
      };
    case "submitSuccess":
      return { ...state, submitting: false, booking: action.booking };
    case "submitError":
      return {
        ...state,
        submitting: false,
        submitError: action.message,
        booking: null,
      };
    case "restart":
      return createInitialBookingState(action.user);
    default:
      return state;
  }
};
