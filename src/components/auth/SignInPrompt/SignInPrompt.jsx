import { Link, useLocation } from "react-router-dom";
import styles from "./SignInPrompt.module.css";

const SignInPrompt = () => {
  const location = useLocation();
  const returnPath = `${location.pathname}${location.search}`;

  return (
    <section className={styles.prompt}>
      <div>
        <p>Reservation</p>
        <h2>Sign in to book this car</h2>
        <span>Your booking will be saved to your account.</span>
      </div>
      <Link to="/sign-in" state={{ from: returnPath }}>
        Sign in
      </Link>
    </section>
  );
};

export default SignInPrompt;
