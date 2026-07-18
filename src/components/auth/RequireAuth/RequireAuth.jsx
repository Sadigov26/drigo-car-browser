import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext/useAppContext";

const RequireAuth = ({ children }) => {
  const { user } = useAppContext();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
};

export default RequireAuth;
