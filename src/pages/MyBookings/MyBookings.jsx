import { useCallback, useMemo, useState } from "react";
import FeedbackMessage from "../../components/feedback/FeedbackMessage/FeedbackMessage";
import Footer from "../../components/layout/Footer/Footer";
import Header from "../../components/layout/Header/Header";
import { useAppContext } from "../../context/AppContext/useAppContext";
import BookingCard from "../../features/bookings/components/BookingCard/BookingCard";
import ConfirmDialog from "../../features/bookings/components/ConfirmDialog/ConfirmDialog";
import { splitBookingsByDate } from "../../features/bookings/utils/bookingAvailability";
import { getTodayDateString } from "../../features/bookings/utils/bookingValidation";
import styles from "./MyBookings.module.css";

const MyBookings = () => {
  const {
    bookings,
    cancelBooking,
    bookingsError,
    bookingsLoading,
    retryBookings,
  } = useAppContext();
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

    try {
      await cancelBooking(bookingId);
    } catch {
      // The context restores the removed booking and shows an error toast.
    }
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

        {bookingsLoading ? (
          <FeedbackMessage message="Loading bookings..." />
        ) : bookingsError ? (
          <FeedbackMessage
            tone="error"
            message={bookingsError.message}
            actionLabel="Retry"
            onAction={retryBookings}
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
