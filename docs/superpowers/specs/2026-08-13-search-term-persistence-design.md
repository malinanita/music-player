# Search Term Persistence — Design

## Goal

Make the Home page's search results survive incidental navigation. Today, navigating to Liked Songs and back to Home (via the sidebar's "Home" link) drops the `?term=` query param, so Home always re-renders unfiltered. This also makes the currently-playing song look disconnected from its origin list, even though the player's queue itself is unaffected (it lives in `PlayerProvider`, mounted in the root layout, which never remounts on navigation).

The fix: remember the last search term and have the sidebar's Home link carry it forward, so returning to Home restores the same results — until the user searches for something else (including an empty search, which explicitly clears it).

## Root cause

`PlayBar` (sidebar nav) lives in the root layout and never remounts when navigating between pages. Its "Home" link is hardcoded to `href="/"`, with no way to know what the user last searched for.

## Behavior

- Searching on Home updates the remembered term (in addition to the URL, as today).
- The sidebar's "Home" link points to `/?term=<remembered term>` when a term is remembered, or plain `/` when it isn't.
- Clearing the search box and submitting empty clears the remembered term (Home link reverts to `/`).
- The remembered term survives a full page reload within the same browser session (`sessionStorage`), but not across browser restarts — matching the existing lifetime of the current song/queue in `PlayerProvider`.
- If Home ever renders with a different term than what's remembered (browser back/forward, a bookmarked/typed URL), the remembered term is resynced to match what's actually on screen.

## Changes

### `context/SearchProvider.tsx` (new)

Mirrors the shape of `context/PlayerProvider.tsx`:

- Holds `lastTerm: string` in React state (default `""`).
- On mount, restores `lastTerm` from `sessionStorage` (new key `"last-search-term"`), same pattern as `PlayerProvider`'s restore of `"current-song"` / `"queue"`.
- Exposes `setLastTerm(term: string)`, which updates state and persists to `sessionStorage`.
- Exposes `lastTerm` and `setLastTerm` via context, with a `useSearch()` hook (mirrors `usePlayer()`).

### `app/layout.tsx`

- Mount `SearchProvider` alongside the existing `PlayerProvider` (order between the two doesn't matter — independent state).

### `components/SearchBar.tsx`

- On submit, call `setLastTerm(term)` in addition to the existing `router.push`.
- Add a `useEffect` that calls `setLastTerm(defaultValue ?? "")` whenever `defaultValue` (the `term` passed down from the Home page) changes, so the remembered term always matches whatever Home is actually displaying, not just what was last explicitly searched.

### `components/PlayBar.tsx`

- Read `lastTerm` from `useSearch()`.
- Change the Home `<Link>`'s `href` from the hardcoded `"/"` to:
  ```
  lastTerm ? `/?term=${encodeURIComponent(lastTerm)}` : "/"
  ```
- No change to the active-tab highlighting logic (`pathname === "/"`), which is already term-agnostic.

### `app/page.tsx`

- No changes. Once the Home link carries the correct `?term=`, the existing server-side fetch-by-searchParams flow already produces the right results.

## Data flow (example)

1. User searches "abc" on Home → URL becomes `/?term=abc`; `SearchBar` calls `setLastTerm("abc")`.
2. User clicks "Liked Songs" → layout persists, `SearchProvider`'s state is untouched.
3. User clicks "Home" in the sidebar → link resolves to `/?term=abc` → Home's existing server-side fetch renders the same results, and the currently-playing song (unaffected the whole time) visibly matches its origin list again.

## Edge cases

- Never searched this session → `lastTerm` stays `""` → Home link stays `/` → today's behavior, unchanged.
- Search cleared (empty submit) → `lastTerm` becomes `""` → Home link reverts to `/`.
- Full reload while on Liked Songs → `sessionStorage` restores `lastTerm` on `SearchProvider` mount, so the Home link is still correct without ever having rendered Home in this page load.
- Browser back/forward through search history → Home re-renders with whatever term is in that URL; `SearchBar`'s sync effect updates `lastTerm` to match, so the sidebar link doesn't point somewhere the user didn't just come from.

## Testing

Manual verification (no existing automated test setup in this project):

- Search for a term, navigate to Liked Songs, click Home — confirm the same results reappear and the playing song (if any) is visibly part of that list again.
- Clear the search box and submit — confirm the Home link (checked via navigating away and back) reverts to showing all songs.
- Reload the page while on Liked Songs after having searched earlier — confirm the Home link still restores the prior search.

## Out of scope

- Persisting search across browser restarts (localStorage) — explicitly session-only per the current player-state pattern.
- Scroll position restoration.
- Remembering search history (multiple past terms) — only the single most recent term is tracked.