import { useEffect, useState } from "react";

const FAVORITES_STORAGE_KEY = "drigo-favorite-cars";

const readStoredFavorites = () => {
  const storedValue = localStorage.getItem(FAVORITES_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (Array.isArray(parsedValue)) {
      return parsedValue;
    }
  } catch {
    return [];
  }

  return [];
};

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState(readStoredFavorites);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (carId) => {
    setFavoriteIds((currentIds) => {
      if (currentIds.includes(carId)) {
        return currentIds.filter((id) => id !== carId);
      }

      return [...currentIds, carId];
    });
  };

  const isFavorite = (carId) => {
    return favoriteIds.includes(carId);
  };

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
  };
};
