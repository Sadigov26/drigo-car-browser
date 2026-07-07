import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <a href="/">
          <h1>Car Browser</h1>
        </a>
        <p>Find the right car for your rental.</p>
      </div>
    </header>
  );
};

export default Header;
