import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1>Car Browser</h1>
        <p>Find the right car for your rental.</p>
      </div>
    </header>
  );
};

export default Header;
