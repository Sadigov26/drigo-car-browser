# Decisions

My async layer starts in `loading` because `useCars` begins with empty data and `loading: true`. The fake `getCars()` API waits about one second before resolving. If it resolves, the hook stores the cars and turns loading off. If it rejects, the hook stores the error, clears the data, and shows the error state with Retry. Retry resets the hook back to `data: []`, `error: null`, and `loading: true`, then changes a reload key so the effect runs the API call again. Empty state is different: it only appears after data loaded successfully but the current filters match zero cars.

Cards open detail pages with React Router. The card navigates to `/cars/:id`, for example `/cars/6`. The detail page does not depend on state from the list; it reads the id from the URL, loads the cars through `useCars`, and finds the matching car. That means a fresh tab can load `/cars/6` directly. If no car matches the id, the page shows a clean not-found message instead of crashing.

The filtered list view is preserved mostly through the URL. Search, filters, sort, and page are written into query params. When a card opens, it also passes the current list URL as `from` state. The detail back link uses that exact path, so the user returns to the same search, filters, sort, and page.

I used `useReducer` because this page has many related controls. Most changes also reset page back to 1, so a reducer keeps that rule in one place. Separate `useState`s would spread the same page-reset logic across many handlers.

On load, `CarBrowser` reads the query string with `useSearchParams`, validates values in `getFilterValuesFromUrl`, then uses those values as the reducer initial state. Bad values like unknown type, invalid sort, negative price, or bad page are ignored or clamped. After filtering and sorting, the page is clamped again if it is out of range, and the URL is rebuilt from the cleaned state.

With one more day, I would add tests around URL parsing and page clamping. Those rules are important because reload and deep links depend on them, and small mistakes there can make the UI look fine until someone opens a copied URL.

## Week 3 app state

I chose React Context with `useReducer` because the signed-in user, bookings, and toast messages are needed on more than one page. Keeping them in one provider means the detail page and My Bookings use the same booking state. Creating and cancelling a booking can update that shared list immediately and roll it back if the mock API fails. The user is also saved in localStorage, so the protected route still recognizes them after reload. Browse search, filters, sort, and page do not belong in this context. They stay in the URL because users need to reload, copy, and revisit the exact same car list view.
