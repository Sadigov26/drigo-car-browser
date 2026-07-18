import { useEffect, useState } from "react";
import {
  getCachedCars,
  getCars,
  getCarsQueryKey,
} from "../../../api/mockApi";

export const useCars = (query) => {
  const [carsState, setCarsState] = useState({
    error: null,
    queryKey: null,
    requestKey: null,
    result: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const queryKey = getCarsQueryKey(query);
  const currentRequestKey = `${queryKey}:${reloadKey}`;
  const cachedResult = getCachedCars(query);
  const stateResult =
    carsState.queryKey === queryKey ? carsState.result : null;
  const currentResult = stateResult || cachedResult;
  const result = currentResult || carsState.result;
  const hasData = Boolean(result);
  const requestFinished = carsState.requestKey === currentRequestKey;

  useEffect(() => {
    let ignoreResult = false;
    const requestKey = `${queryKey}:${reloadKey}`;
    const requestQuery = JSON.parse(queryKey);

    getCars(requestQuery)
      .then((result) => {
        if (ignoreResult) {
          return;
        }

        setCarsState({
          result,
          error: null,
          queryKey,
          requestKey,
        });
      })
      .catch((error) => {
        if (ignoreResult) {
          return;
        }

        setCarsState((currentState) => ({
          ...currentState,
          error,
          requestKey,
        }));
      });

    return () => {
      ignoreResult = true;
    };
  }, [queryKey, reloadKey]);

  const retry = () => {
    setReloadKey((currentKey) => currentKey + 1);
  };

  return {
    cars: result?.cars ?? [],
    error: requestFinished ? carsState.error : null,
    hasData,
    loading: !hasData && !requestFinished,
    page: result?.page ?? 1,
    pageCount: result?.pageCount ?? 1,
    retry,
    total: result?.total ?? 0,
    updating: hasData && !requestFinished,
  };
};
