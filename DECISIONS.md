# Week 3 Decisions

## 1. Mock data layer

The mock data layer is in `src/api/mockApi.js`. It imports the car and initial booking JSON files, but components never import that data directly. It exposes `getCars(query)`, `getCar(id)`, `getBookings(user)`, `createBooking(data)`, and `cancelBooking(id)`. `runMockRequest` wraps every operation in a Promise, waits a random 600-1200ms, and rejects about 10% of requests. This makes loading and error states real without a backend. Cars remain seed data, while bookings are read from and written to localStorage. If stored booking data is missing or invalid, the layer safely falls back to the seed bookings.

## 2. Preventing stale results

`useCars` creates an effect for the current query key and uses an `ignoreResult` flag. The effect cleanup changes that flag to true when the query changes or the component unmounts. For example, the user may search for "Toy" and quickly continue to "Toyota". The Toyota request can finish first even though it started later. Without the guard, the slower Toy response could arrive afterwards and replace the correct Toyota list. With the cleanup flag, the old callback sees that it is ignored and cannot update state. A unit test starts two requests and finishes them in reverse order to verify this behavior.

## 3. Cache and invalidation

The cache is an in-memory pair of Maps: list results use a normalized query key and detail results use the car id. A cached result renders immediately, then the hook requests fresh data and shows a small updating state. Each request records the current cache version. Creating or cancelling a booking increments that version, clears list caches, and deletes the affected car detail cache. An older request from before invalidation cannot write its stale response because its version no longer matches. This keeps availability correct after mutations.

## 4. Availability and overlap

Overlap logic lives in the pure `bookingAvailability.js` utility, not in a component. Two ranges conflict when the first start is before the second end and the first end is after the second start. `findOverlappingBooking` also requires the same car id. The wizard uses this function for immediate feedback, and `createBooking` runs it again as the final authority. Keeping it pure makes the rule reusable and easy to unit-test. The API check is still required because UI validation alone can become outdated.

## 5. App state

I chose React Context with `useReducer`, without an external state library. The signed-in user, bookings, optimistic mutation state, and toast messages are shared by detail and booking pages, so they live in app state. The user and bookings are persisted in localStorage. An unfinished wizard draft is stored in sessionStorage per car and user, so refreshing the detail page restores the form without making it permanent. Browse search, filters, sort, and page stay in the URL. They are validated when read and rebuilt from active values. This split means a copied or reloaded browse URL restores the exact view, while temporary application behavior does not make the URL noisy.

## 6. Protected routes

`RequireAuth` checks the shared user. When there is no user, it redirects to `/sign-in` and stores the attempted path in router location state. After successful validation, Sign In saves the user and navigates to that stored path with `replace: true`. Therefore opening `/bookings` while signed out returns to `/bookings`, instead of always going home, after sign-in.

## 7. Accessibility and performance

When the cancel dialog opens, focus moves to "Keep booking." Tab and Shift+Tab stay inside the dialog, Escape closes it, and focus returns to the Cancel button that opened it. Route and wizard step changes also move focus to the new heading. For performance, I measured cache behavior in the `useCars` test: cached cars are available before the fake 600ms timer advances, while an uncached request remains loading until the timer completes. This confirmed that back navigation can render cached content immediately and revalidate in the background.

## 8. Next improvement

With three more days, I would first add an integration test covering two almost simultaneous booking attempts for the same car and dates. The pure overlap tests and full booking test already cover normal behavior, but a concurrent mutation test would better protect the most important business rule and the optimistic rollback path together.
