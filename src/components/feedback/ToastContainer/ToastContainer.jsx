import { useEffect } from "react";
import { useAppContext } from "../../../context/AppContext/useAppContext";
import styles from "./ToastContainer.module.css";

const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onRemove(toast.id);
    }, 3500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onRemove, toast.id]);

  return (
    <div
      className={
        toast.tone === "error"
          ? `${styles.toast} ${styles.errorToast}`
          : `${styles.toast} ${styles.successToast}`
      }
      role="status"
    >
      <span>{toast.message}</span>
      <button type="button" onClick={() => onRemove(toast.id)}>
        Close
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { removeToast, toasts } = useAppContext();

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
