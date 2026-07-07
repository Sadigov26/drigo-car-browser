import styles from "./FeedbackMessage.module.css";

const FeedbackMessage = ({ tone = "default", message, actionLabel, onAction }) => {
  return (
    <div className={`${styles.message} ${styles[tone]}`}>
      <p>{message}</p>

      {actionLabel && (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default FeedbackMessage;
