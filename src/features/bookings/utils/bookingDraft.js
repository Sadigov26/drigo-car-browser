const BOOKING_DRAFT_PREFIX = "drigo-booking-draft";

const getDraftKey = (carId, userEmail) => {
  return `${BOOKING_DRAFT_PREFIX}:${carId}:${userEmail || "guest"}`;
};

const getStringValue = (value) => {
  return typeof value === "string" ? value : "";
};

export const readBookingDraft = (carId, userEmail) => {
  if (typeof sessionStorage === "undefined") {
    return null;
  }

  try {
    const savedDraft = sessionStorage.getItem(getDraftKey(carId, userEmail));

    if (!savedDraft) {
      return null;
    }

    const draft = JSON.parse(savedDraft);
    const step = Number(draft?.step);

    if (!draft || typeof draft !== "object") {
      return null;
    }

    return {
      step: [1, 2, 3].includes(step) ? step : 1,
      startDate: getStringValue(draft.startDate),
      endDate: getStringValue(draft.endDate),
      driver: {
        fullName: getStringValue(draft.driver?.fullName),
        email: getStringValue(draft.driver?.email),
        licenseNumber: getStringValue(draft.driver?.licenseNumber),
      },
    };
  } catch {
    return null;
  }
};

export const saveBookingDraft = (carId, userEmail, draft) => {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(
      getDraftKey(carId, userEmail),
      JSON.stringify(draft),
    );
  } catch {
    // A storage failure should not block the booking form.
  }
};

export const clearBookingDraft = (carId, userEmail) => {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(getDraftKey(carId, userEmail));
  } catch {
    // A storage failure should not block a completed booking.
  }
};
