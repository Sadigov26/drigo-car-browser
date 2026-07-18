import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext/useAppContext";
import styles from "./Header.module.css";

const Header = () => {
  const { signOut, user } = useAppContext();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link className={styles.brand} to="/">
          <h1>Car Browser</h1>
        </Link>
        <div className={styles.headerRight}>
          <p>Find the right car for your rental.</p>
          <div className={styles.navRow}>
            <nav className={styles.navigation}>
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/bookings">My Bookings</NavLink>
            </nav>
            {user ? (
              <div className={styles.userArea}>
                <span>{user.name}</span>
                <button type="button" onClick={signOut}>
                  Sign out
                </button>
              </div>
            ) : (
              <NavLink className={styles.signInLink} to="/sign-in">
                Sign in
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
