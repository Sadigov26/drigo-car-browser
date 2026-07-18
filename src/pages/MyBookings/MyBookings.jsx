import { useCallback, useMemo, useState } from "react";
import FeedbackMessage from "../../components/feedback/FeedbackMessage/FeedbackMessage";
import Footer from "../../components/layout/Footer/Footer";
import Header from "../../components/layout/Header/Header";
import BookingCard from "../../features/bookings/components/BookingCard/BookingCard";
import ConfirmDialog from "../../features/bookings/components/ConfirmDialog/ConfirmDialog";
import { useBookings } from "../../features/bookings/hooks/useBookings";
import {
  splitBookingsByDate,
} from "../../features/bookings/utils/bookingAvailability";
import { getTodayDateString } from "../../features/bookings/utils/bookingValidation";
import styles from "./MyBookings.module.css";

const MyBookings = () => {
  const {
    bookings,
    cancelBooking,
    cancellingId,
    dismissMutationError,
    error,
    loading,
    mutationError,
    retry,
  } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const bookingGroups = useMemo(
    () => splitBookingsByDate(bookings, getTodayDateString()),
    [bookings],
  );

  const closeDialog = useCallback(() => {
    setSelectedBooking(null);
  }, []);

  const confirmCancellation = async () => {
    const bookingId = selectedBooking.id;

    closeDialog();
    await cancelBooking(bookingId);
  };

  const renderBookingList = (bookingList, canCancel) => {
    if (!bookingList.length) {
      return (
        <p className={styles.sectionEmpty}>
          No {canCancel ? "upcoming" : "past"} bookings.
        </p>
      );
    }

    return (
      <div className={styles.bookingList}>
        {bookingList.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            canCancel={canCancel}
            isCancelling={cancellingId === booking.id}
            onCancel={setSelectedBooking}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.container}>
        <div className={styles.pageHeading}>
          <p>Reservations</p>
          <h1>My Bookings</h1>
          <span>View and manage your rental history.</span>
        </div>

        {mutationError && (
          <div className={styles.mutationError}>
            <span>{mutationError}</span>
            <button type="button" onClick={dismissMutationError}>
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <FeedbackMessage message="Loading bookings..." />
        ) : error ? (
          <FeedbackMessage
            tone="error"
            message={error.message}
            actionLabel="Retry"
            onAction={retry}
          />
        ) : !bookings.length ? (
          <FeedbackMessage message="You do not have any bookings yet." />
        ) : (
          <div className={styles.sections}>
            <section>
              <div className={styles.sectionHeading}>
                <h2>Upcoming</h2>
                <span>{bookingGroups.upcoming.length}</span>
              </div>
              {renderBookingList(bookingGroups.upcoming, true)}
            </section>

            <section>
              <div className={styles.sectionHeading}>
                <h2>Past</h2>
                <span>{bookingGroups.past.length}</span>
              </div>
              {renderBookingList(bookingGroups.past, false)}
            </section>
          </div>
        )}
      </main>
      <Footer />

      {selectedBooking && (
        <ConfirmDialog
          booking={selectedBooking}
          onCancel={closeDialog}
          onConfirm={confirmCancellation}
        />
      )}
    </div>
  );
};

export default MyBookings;
