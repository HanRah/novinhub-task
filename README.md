# User Management Application

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

## ⚡ Performance Optimizations

### 1. Server-Side Rendering (SSR) with Initial Data

The `page.tsx` server component fetches users on the server and passes them as `initialUsers` to the client component. This eliminates a client-side loading spinner on first visit and lets users see data immediately without waiting for a second network request.

### 2. `useDeferredValue` for Non-Blocking Search

Since the search and filtering are handled entirely on the client side (no backend API call per keystroke), `useDeferredValue` is the ideal choice over a traditional debounce. Debounce is mainly useful when you need to limit network requests to a server, but here there are no requests to throttle — the cost is purely the React re-render triggered by filtering and re-rendering the list. `useDeferredValue` lets React defer that re-render work to a lower priority, keeping the search input instantly responsive (no typing lag) while the filtered results update in the background. A visual "در حال جستجو..." indicator and a subtle opacity transition are shown while the deferred value catches up.

### 3. `React.memo` on All Leaf Components

Every presentational component (`UserList`, `UserCard`, `HighlightText`, `SearchInput`, `Pagination`) is wrapped with `React.memo()`. This prevents unnecessary re-renders when their props haven't changed — for example, when only the pagination changes, user cards that remain the same are not re-rendered.

### 4. `useMemo` for Expensive Computations

- **Filtering** — The filtered user list (`filteredUsers`) is memoized so the filter logic only re-runs when the raw user data or the search query actually changes.
- **Pagination slicing** — The paginated subset (`users`) is memoized based on the filtered list, current page, and page size.
- **Page number generation** — The `Pagination` component memoizes the page numbers array to avoid recalculating it on every render.
- **Highlight text splitting** — `HighlightText` memoizes its regex-based text segmentation so it only re-processes when the text or query changes.

### 5. `useCallback` for Stable Function References

Functions like `fetchUsers`, `goToPage`, `nextPage`, and `previousPage` are wrapped with `useCallback`. This ensures stable references across renders, which works hand-in-hand with `React.memo` on child components to prevent unnecessary re-renders.

### 6. AbortController for Fetch Requests

An `AbortController` is used when fetching users. If a new fetch is triggered before the previous one completes, the old request is aborted. This prevents race conditions and wasted network resources. The controller is also cleaned up on component unmount.

### 7. Component Decomposition

The UI is split into small, focused components (`SearchInput`, `UserList`, `UserCard`, `Pagination`, `LoadingSpinner`, `ErrorMessage`, `HighlightText`). This limits the re-render blast radius — when state changes, only the affected components re-render rather than the entire page.

## 📄 Why Pagination over Infinite Scroll & Virtualization

### Why not Infinite Scroll?

Infinite scroll keeps appending DOM nodes as the user scrolls, which means memory usage grows continuously. It also makes it harder for users to reach the footer, share a link to a specific "page" of results, or mentally track where they are in the list. For a user management list where users typically want to browse or search for specific people, traditional pagination gives a clearer sense of position and total count.

### Why not Virtualization?

Virtualization (e.g. `react-window` or `react-virtuoso`) is designed for rendering very large lists (hundreds or thousands of items) by only mounting the visible rows in the DOM. In this case Adding a virtualization library would introduce extra complexity and bundle size with no real performance gain. Pagination already ensures only a small slice of data is rendered at any given time, achieving the same DOM-efficiency benefit without additional dependencies.