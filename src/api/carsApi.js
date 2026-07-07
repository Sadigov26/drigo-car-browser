import cars from "../data/cars.json";

const getRandomDelay = () => {
  return 800 + Math.floor(Math.random() * 401);
};

export const getCars = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() < 0.2;

      if (shouldFail) {
        reject(new Error("Could not load cars. Please try again."));
        return;
      }

      resolve(cars);
    }, getRandomDelay());
  });
};
