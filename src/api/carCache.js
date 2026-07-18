const listCache = new Map();
const detailCache = new Map();
let cacheVersion = 0;

const copyListResult = (result) => {
  return {
    ...result,
    cars: result.cars.map((car) => ({ ...car })),
  };
};

const copyCar = (car) => {
  return car ? { ...car } : null;
};

export const getCacheVersion = () => {
  return cacheVersion;
};

export const readListCache = (queryKey) => {
  const cachedResult = listCache.get(queryKey);
  return cachedResult ? copyListResult(cachedResult) : null;
};

export const writeListCache = (queryKey, result, requestVersion) => {
  if (requestVersion === cacheVersion) {
    listCache.set(queryKey, copyListResult(result));
  }
};

export const readDetailCache = (carId) => {
  const cacheKey = String(carId);

  if (!detailCache.has(cacheKey)) {
    return { car: null, hasValue: false };
  }

  return {
    car: copyCar(detailCache.get(cacheKey)),
    hasValue: true,
  };
};

export const writeDetailCache = (carId, car, requestVersion) => {
  if (requestVersion === cacheVersion) {
    detailCache.set(String(carId), copyCar(car));
  }
};

export const invalidateCarCaches = (carId) => {
  cacheVersion += 1;
  listCache.clear();
  detailCache.delete(String(carId));
};

export const clearCarCaches = () => {
  cacheVersion += 1;
  listCache.clear();
  detailCache.clear();
};
