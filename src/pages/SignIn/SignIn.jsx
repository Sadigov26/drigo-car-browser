import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/layout/Footer/Footer";
import Header from "../../components/layout/Header/Header";
import { useAppContext } from "../../context/AppContext/useAppContext";
import styles from "./SignIn.module.css";

const validateForm = ({ name, email }) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
};

const SignIn = () => {
  const { signIn } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const returnPath = location.state?.from || "/";

  const handleChange = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm(form);

    setErrors(formErrors);

    if (Object.keys(formErrors).length) {
      return;
    }

    signIn({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
    });
    navigate(returnPath, { replace: true });
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.heading}>
            <p>Account</p>
            <h1>Sign in</h1>
            <span>Use your name and email to manage your rentals.</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="sign-in-name">Name</label>
            <input
              id="sign-in-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
            />
            {errors.name && <span>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="sign-in-email">Email</label>
            <input
              id="sign-in-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="email"
            />
            {errors.email && <span>{errors.email}</span>}
          </div>

          <button className={styles.submitButton} type="submit">
            Sign in
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
