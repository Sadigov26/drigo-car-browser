import {
  MIN_RENTAL_DAYS,
  SERVICE_FEE,
} from "../constants/bookingOptions";

const parseDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getTodayDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getRentalDays = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start || !end || end <= start) {
    return 0;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / millisecondsPerDay);
};

export const validateDateRange = (
  { startDate, endDate },
  today = getTodayDateString(),
) => {
  const errors = {};

  if (!startDate) {
    errors.startDate = "Choose a start date.";
  } else if (startDate < today) {
    errors.startDate = "Start date cannot be in the past.";
  }

  if (!endDate) {
    errors.endDate = "Choose an end date.";
  } else if (startDate && endDate <= startDate) {
    errors.endDate = "End date must be after the start date.";
  } else if (
    startDate &&
    getRentalDays(startDate, endDate) < MIN_RENTAL_DAYS
  ) {
    errors.endDate = `Minimum rental length is ${MIN_RENTAL_DAYS} days.`;
  }

  return errors;
};

export const validateDriverDetails = ({
  fullName,
  email,
  licenseNumber,
}) => {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!licenseNumber.trim()) {
    errors.licenseNumber = "Driver license number is required.";
  }

  return errors;
};

export const calculateBookingPrice = (
  startDate,
  endDate,
  pricePerDay,
) => {
  const days = getRentalDays(startDate, endDate);

  if (!days) {
    return {
      days: 0,
      rentalCost: 0,
      serviceFee: SERVICE_FEE,
      total: 0,
    };
  }

  const rentalCost = days * pricePerDay;

  return {
    days,
    rentalCost,
    serviceFee: SERVICE_FEE,
    total: rentalCost + SERVICE_FEE,
  };
};

export const hasValidationErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
