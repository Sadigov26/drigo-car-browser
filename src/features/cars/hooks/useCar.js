import { useEffect, useState } from "react";
import { getCachedCar, getCar } from "../../../api/mockApi";

export const useCar = (id) => {
  const [carState, setCarState] = useState({
    car: null,
    error: null,
    hasValue: false,
    id: null,
    requestKey: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const currentRequestKey = `${id}:${reloadKey}`;
  const cachedResult = getCachedCar(id);
  const stateHasValue = carState.id === String(id) && carState.hasValue;
  const car = stateHasValue ? carState.car : cachedResult.car;
  const hasData = stateHasValue || cachedResult.hasValue;
  const requestFinished = carState.requestKey === currentRequestKey;

  useEffect(() => {
    let ignoreResult = false;
    const requestKey = `${id}:${reloadKey}`;

    getCar(id)
      .then((car) => {
        if (ignoreResult) {
          return;
        }

        setCarState({
          car,
          error: null,
          hasValue: true,
          id: String(id),
          requestKey,
        });
      })
      .catch((error) => {
        if (ignoreResult) {
          return;
        }

        setCarState({
          car: null,
          error,
          hasValue: false,
          id: String(id),
          requestKey,
        });
      });

    return () => {
      ignoreResult = true;
    };
  }, [id, reloadKey]);

  const retry = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  return {
    car,
    error: requestFinished ? carState.error : null,
    hasData,
    loading: !hasData && !requestFinished,
    retry,
    updating: hasData && !requestFinished,
  };
};
