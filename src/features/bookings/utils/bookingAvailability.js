export const dateRangesOverlap = (
  firstStart,
  firstEnd,
  secondStart,
  secondEnd,
) => {
  if (!firstStart || !firstEnd || !secondStart || !secondEnd) {
    return false;
  }

  return firstStart < secondEnd && firstEnd > secondStart;
};

export const findOverlappingBooking = (
  bookings,
  { carId, startDate, endDate, ignoredBookingId },
) => {
  return bookings.find((booking) => {
    return (
      Number(booking.carId) === Number(carId) &&
      booking.id !== ignoredBookingId &&
      dateRangesOverlap(
        startDate,
        endDate,
        booking.startDate,
        booking.endDate,
      )
    );
  });
};

export const getBookingsForCar = (bookings, carId) => {
  return bookings
    .filter((booking) => Number(booking.carId) === Number(carId))
    .sort((firstBooking, secondBooking) =>
      firstBooking.startDate.localeCompare(secondBooking.startDate),
    );
};

export const splitBookingsByDate = (bookings, today) => {
  const sortedBookings = [...bookings].sort((firstBooking, secondBooking) =>
    firstBooking.startDate.localeCompare(secondBooking.startDate),
  );

  return {
    upcoming: sortedBookings.filter((booking) => booking.endDate >= today),
    past: sortedBookings
      .filter((booking) => booking.endDate < today)
      .reverse(),
  };
};

export const formatBookingDate = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
};
