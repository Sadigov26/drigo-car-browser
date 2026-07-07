# Drigo Week 2 Car Browser

React app for browsing a car rental dataset. The app loads cars through a fake async API, supports search, filters, sorting, pagination, detail pages, favorites, and keeps the current view in the URL query string.

## Features

- Fake async API with loading, error, and retry states
- Search cars by name with a custom 300ms debounce
- Debounced min and max price filters
- Filter by transmission, multiple car types, seats, availability, and favorites
- Sort by price and name
- Pagination with the current page stored in the URL
- Detail route for each car: `/cars/:id`
- Clean not-found state for unknown car ids
- Back to results restores the previous filtered/sorted/paged view
- Favorites persisted with localStorage
- Filter, search, sort, and page state managed with `useReducer`
- Visible car list derived with `useMemo`
- Unit tests for filtering, sorting, debounce, and URL helpers
- Responsive layout for smaller screens

## Tech Stack

- React
- Vite
- React Router
- CSS Modules
- Vitest
- Testing Library

## How To Run

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## How To Test

```bash
npm test
npm run lint
npm run build
```

## Project Notes

The car data is stored in `src/data/cars.json`, but UI components do not import it directly. Cars are loaded through `src/features/cars/api/carsApi.js` and consumed with the custom `useCars()` hook.

Main logic locations:

- `src/pages/CarBrowser/CarBrowser.jsx` - list page, URL sync, and derived visible list
- `src/pages/CarDetail/CarDetail.jsx` - detail route and not-found state
- `src/features/cars/reducers/carFiltersReducer.js` - filter, search, sort, and page reducer
- `src/features/cars/utils/carList.js` - pure filter, sort, and pagination helpers
- `src/features/cars/utils/urlFilters.js` - URL query parsing and building
- `src/features/cars/hooks/useDebounce.js` - shared debounce hook
- `src/features/cars/hooks/useFavorites.js` - localStorage favorite state
