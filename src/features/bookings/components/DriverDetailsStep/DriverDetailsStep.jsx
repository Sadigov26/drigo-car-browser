import styles from "./DriverDetailsStep.module.css";

const DriverDetailsStep = ({ driver, errors, onChange }) => {
  return (
    <div className={styles.stepContent}>
      <div className={styles.intro}>
        <h3>Driver details</h3>
        <p>Enter the details of the person who will drive the car.</p>
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
          />
          {errors.fullName && (
            <span className={styles.error}>{errors.fullName}</span>
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
          />
          {errors.email && (
            <span className={styles.error}>{errors.email}</span>
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
          />
          {errors.licenseNumber && (
            <span className={styles.error}>{errors.licenseNumber}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsStep;
