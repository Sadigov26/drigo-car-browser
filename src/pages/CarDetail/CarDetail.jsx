import { Link, useLocation, useParams } from "react-router-dom";
import FeedbackMessage from "../../components/feedback/FeedbackMessage/FeedbackMessage";
import Footer from "../../components/layout/Footer/Footer";
import Header from "../../components/layout/Header/Header";
import { useCars } from "../../features/cars/hooks/useCars";
import styles from "./CarDetail.module.css";

const CarDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { data: cars, error, loading, retry } = useCars();
  const car = cars.find((carItem) => carItem.id === Number(id));
  const backPath = location.state?.from || "/";

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.detailContainer}>
        {loading ? (
          <FeedbackMessage message="Loading car details..." />
        ) : error ? (
          <FeedbackMessage
            tone="error"
            message={error.message}
            actionLabel="Retry"
            onAction={retry}
          />
        ) : car ? (
          <article className={styles.detailCard}>
            <Link className={styles.backLink} to={backPath}>
              Back to results
            </Link>

            <section className={styles.summary}>
              <div>
                <p className={styles.eyebrow}>Rental car details</p>
                <div className={styles.headerRow}>
                  <h1>{car.name}</h1>
                  <span
                    className={
                      car.available
                        ? `${styles.badge} ${styles.available}`
                        : `${styles.badge} ${styles.unavailable}`
                    }
                  >
                    {car.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className={styles.summaryText}>
                  {car.type} vehicle with {car.transmission.toLowerCase()}{" "}
                  transmission and {car.seats} seats.
                </p>
              </div>

              <div className={styles.priceBox}>
                <span>Daily price</span>
                <strong>${car.pricePerDay}</strong>
              </div>
            </section>

            <div className={styles.infoList}>
              <p>
                <strong>Type</strong>
                <span>{car.type}</span>
              </p>
              <p>
                <strong>Transmission</strong>
                <span>{car.transmission}</span>
              </p>
              <p>
                <strong>Seats</strong>
                <span>{car.seats}</span>
              </p>
              <p>
                <strong>Price per day</strong>
                <span>${car.pricePerDay}</span>
              </p>
              <p>
                <strong>Car ID</strong>
                <span>{car.id}</span>
              </p>
            </div>
          </article>
        ) : (
          <div className={styles.notFound}>
            <p>Car not found.</p>
            <Link to={backPath}>Back to cars</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CarDetail;
