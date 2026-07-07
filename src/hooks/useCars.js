import { useEffect, useState } from "react";
import { getCars } from "../api/carsApi";

export const useCars = () => {
  const [carsState, setCarsState] = useState({
    data: [],
    error: null,
    loading: true,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    getCars()
      .then((cars) => {
        if (!isCurrentRequest) {
          return;
        }

        setCarsState({
          data: cars,
          error: null,
          loading: false,
        });
      })
      .catch((error) => {
        if (!isCurrentRequest) {
          return;
        }

        setCarsState({
          data: [],
          error,
          loading: false,
        });
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [reloadKey]);

  const retry = () => {
    setCarsState({
      data: [],
      error: null,
      loading: true,
    });
    setReloadKey((currentKey) => currentKey + 1);
  };

  return {
    data: carsState.data,
    error: carsState.error,
    loading: carsState.loading,
    retry,
  };
};
