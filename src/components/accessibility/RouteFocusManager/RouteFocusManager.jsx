import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteFocusManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageHeading = document.querySelector("main h1");

    if (pageHeading) {
      pageHeading.setAttribute("tabindex", "-1");
      pageHeading.focus();
    }
  }, [pathname]);

  return null;
};

export default RouteFocusManager;
