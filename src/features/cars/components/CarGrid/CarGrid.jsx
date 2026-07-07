import CarCard from "../CarCard/CarCard";
import styles from "./CarGrid.module.css";

function CarGrid({ cars, isFavorite, onFavoriteToggle }) {
  return (
    <section className={styles.carGrid}>
      {cars.map((car) => (
        <CarCard
          className={styles.card}
          isFavorite={isFavorite(car.id)}
          key={car.id}
          car={car}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </section>
  );
}

export default CarGrid;
