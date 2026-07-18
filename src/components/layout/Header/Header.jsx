import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link className={styles.brand} to="/">
          <h1>Car Browser</h1>
        </Link>
        <div className={styles.headerRight}>
          <p>Find the right car for your rental.</p>
          <nav className={styles.navigation}>
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/bookings">
              My Bookings
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
