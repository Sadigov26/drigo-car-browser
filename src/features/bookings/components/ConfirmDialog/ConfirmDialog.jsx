import { useEffect, useRef } from "react";
import styles from "./ConfirmDialog.module.css";

const ConfirmDialog = ({ booking, onCancel, onConfirm }) => {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div className={styles.overlay}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-booking-title"
      >
        <h2 id="cancel-booking-title">Cancel booking?</h2>
        <p>
          Your reservation for <strong>{booking.carName}</strong> will be
          cancelled.
        </p>
        <div className={styles.actions}>
          <button
            ref={cancelButtonRef}
            className={styles.secondaryButton}
            type="button"
            onClick={onCancel}
          >
            Keep booking
          </button>
          <button
            className={styles.dangerButton}
            type="button"
            onClick={onConfirm}
          >
            Cancel booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
