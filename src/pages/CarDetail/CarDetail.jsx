import { Link, useLocation, useParams } from "react-router-dom";
import FeedbackMessage from "../../components/feedback/FeedbackMessage/FeedbackMessage";
import Footer from "../../components/layout/Footer/Footer";
import Header from "../../components/layout/Header/Header";
import { useCar } from "../../features/cars/hooks/useCar";
import { useFavorites } from "../../features/cars/hooks/useFavorites";
import styles from "./CarDetail.module.css";

const CarDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const {
    car,
    error,
    hasData,
    loading,
    retry,
    updating,
  } = useCar(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const backPath = location.state?.from || "/";

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.detailContainer}>
        {updating && (
          <p className={styles.updateStatus} role="status">
            Updating car details...
          </p>
        )}

        {error && hasData && (
          <div className={styles.refreshError}>
            <span>{error.message}</span>
            <button type="button" onClick={retry}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <FeedbackMessage message="Loading car details..." />
        ) : error && !hasData ? (
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
                  <div className={styles.statusBox}>
                    <span
                      className={
                        car.available
                          ? `${styles.badge} ${styles.available}`
                          : `${styles.badge} ${styles.unavailable}`
                      }
                    >
                      {car.available ? "Available" : "Unavailable"}
                    </span>
                    <button
                      className={
                        isFavorite(car.id)
                          ? `${styles.favoriteButton} ${styles.favoriteButtonActive}`
                          : styles.favoriteButton
                      }
                      type="button"
                      onClick={() => toggleFavorite(car.id)}
                    >
                      <span>{isFavorite(car.id) ? "\u2605" : "\u2606"}</span>
                    </button>
                  </div>
                </div>
                <p className={styles.summaryText}>
                  {car.type} vehicle with {car.transmission.toLowerCase()}{" "}
                  transmission and {car.seats} seats.
                </p>
              </div>

            </section>

            <div className={styles.priceBox}>
              <span>Daily price</span>
              <strong>${car.pricePerDay}</strong>
            </div>

            <div className={styles.infoList}>
              <p>
                <strong>Car ID</strong>
                <span>{car.id}</span>
              </p>
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
