import styles from "./DriverDetailsStep.module.css";

const DriverDetailsStep = ({ driver, errors, onChange }) => {
  return (
    <div
      className={styles.stepContent}
      role="group"
      aria-labelledby="driver-details-heading"
      aria-describedby="driver-details-help"
    >
      <div className={styles.intro}>
        <h3 id="driver-details-heading" tabIndex="-1" data-booking-focus>
          Driver details
        </h3>
        <p id="driver-details-help">
          Enter the details of the person who will drive the car.
        </p>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="driver-full-name">Full name</label>
          <input
            id="driver-full-name"
            name="fullName"
            type="text"
            value={driver.fullName}
            onChange={onChange}
            placeholder="Example: Kamil Sadigov"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={
              errors.fullName
                ? "driver-name-error driver-details-help"
                : "driver-details-help"
            }
          />
          {errors.fullName && (
            <span id="driver-name-error" className={styles.error}>
              {errors.fullName}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="driver-email">Email</label>
          <input
            id="driver-email"
            name="email"
            type="email"
            value={driver.email}
            onChange={onChange}
            placeholder="name@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email
                ? "driver-email-error driver-details-help"
                : "driver-details-help"
            }
          />
          {errors.email && (
            <span id="driver-email-error" className={styles.error}>
              {errors.email}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="driver-license">Driver license number</label>
          <input
            id="driver-license"
            name="licenseNumber"
            type="text"
            value={driver.licenseNumber}
            onChange={onChange}
            placeholder="Example: AZE1234567"
            aria-invalid={Boolean(errors.licenseNumber)}
            aria-describedby={
              errors.licenseNumber
                ? "driver-license-error driver-details-help"
                : "driver-details-help"
            }
          />
          {errors.licenseNumber && (
            <span id="driver-license-error" className={styles.error}>
              {errors.licenseNumber}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsStep;
