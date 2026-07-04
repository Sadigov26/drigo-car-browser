import CarCard from '../CarCard/CarCard'
import styles from './CarGrid.module.css'

function CarGrid({ cars }) {
  return (
    <section className={styles.carGrid}>
      {cars.map((car) => (
        <CarCard className={styles.card} key={car.id} car={car} />
      ))}
    </section>
  )
}

export default CarGrid