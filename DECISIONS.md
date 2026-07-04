# Decisions

My debounce uses two pieces of state: `searchText` and `debouncedSearchText`. `searchText` changes immediately when the user types in the input. Then a `useEffect` starts a 300ms `setTimeout`. If the user keeps typing before the 300ms finishes, the cleanup function runs and clears the old timeout with `clearTimeout`. That means the filtered list only updates after the user stops typing for 300ms, instead of filtering on every key press.

The filter state lives in the `CarBrowser` page component. I kept it there because this page owns the full car list and also decides which cars should be shown. Components like `SearchBox` and `CarGrid` stay simpler this way. `SearchBox` only displays controls and sends changes back up through props. `CarGrid` only receives the final filtered and sorted cars and renders them.

When the page loads with filters already in the URL, `CarBrowser` reads the query string using `useSearchParams`. I have a helper function that gets values like `search`, `transmission`, `type`, `available`, and `sort` from the URL. These values become the initial React state. After that, the component filters the local `cars.json` data, sorts the result by price, and renders the matching cards. If the user changes a filter, another effect builds a new query string and updates the URL, so refreshing the page keeps the same view.

If I had one more day, the first thing I would refactor is the filter and URL logic. Right now it works, but `CarBrowser` has several responsibilities: reading URL params, storing state, filtering, sorting, and rendering the page. I would move the filter defaults and URL helper logic into a small separate file or custom hook so the page component is easier to read and extend in Week 2.
