# Drigo Week 3 Car Rental Platform

A self-contained React rental app with server-like async data loading. Users can browse cars, sign in, create a validated booking, view their bookings, and cancel upcoming reservations without a real backend.

## Features

- Mock async data layer with 600-1200ms latency and a small failure rate
- API-driven search, filtering, sorting, pagination, and total count
- URL-synced browse state that survives reloads and deep links
- Latest-request-wins protection for rapid filter changes
- In-memory list/detail caching with background revalidation
- Multi-step booking wizard with a refresh-safe draft
- Date, minimum rental length, driver, overlap, and price validation
- Live rental price with a fixed service fee
- Booking persistence through localStorage
- Optimistic booking creation and cancellation with rollback
- Upcoming and Past sections on the protected My Bookings page
- Persisted mock sign-in with return-to-intended-page behavior
- Route, wizard, and dialog focus management
- Hand-built confirmation dialog, toast system, and error boundary
- Responsive layout and reduced-motion support

## Tech Stack

- React
- Vite
- React Router
- CSS Modules
- Vitest
- React Testing Library

No UI component kit, data-fetching library, date library, or real API is used.

## How To Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## How To Test

```bash
npm test
npm run lint
npm run build
```

The test suite includes unit and integration coverage for the mock API, stale-result protection, caching, URL parsing, debounce, overlap rules, price calculation, booking flow, protected routes, optimistic rollback, draft restoration, and accessibility behavior.

## Project Structure

- `src/api/mockApi.js` - async cars and bookings operations
- `src/api/carCache.js` - in-memory list/detail cache and invalidation
- `src/context/AppContext` - shared user, bookings, mutations, and toasts
- `src/features/cars` - browse components, hooks, reducer, and pure helpers
- `src/features/bookings` - wizard, booking components, reducer, and rules
- `src/pages` - Car Browser, Car Detail, Sign In, and My Bookings pages
- `src/router` - application routes and protected-route integration tests

## Persistence

- The signed-in user and bookings are stored in localStorage.
- Favorites are stored in localStorage.
- An unfinished booking form is stored in sessionStorage per car and user.
- Search, filters, sort, and page are stored in the URL query string.

The mock API intentionally fails occasionally. Loading, retry, updating, and empty states are part of the expected app behavior.
