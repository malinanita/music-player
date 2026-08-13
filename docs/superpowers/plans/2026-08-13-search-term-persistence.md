# Search Term Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the sidebar's "Home" link remember the last search term, so navigating to Liked Songs and back to Home restores the same results instead of dropping to the unfiltered list.

**Architecture:** A new `SearchProvider` context (mirroring the existing `PlayerProvider` pattern) holds `lastTerm` in React state, restored from `sessionStorage` on mount. `SearchBar` updates it on every submit and whenever the Home page renders with a different term (so browser back/forward stays truthful). `PlayBar`'s "Home" link — which lives in the root layout and never remounts on navigation — reads `lastTerm` and points at `/?term=<lastTerm>` instead of a hardcoded `/`. `app/page.tsx`'s existing server-side fetch-by-searchParams logic needs no changes: once the link carries the right query param, the current flow already produces the right results.

**Tech Stack:** Next.js (App Router), React, TypeScript, sessionStorage for cross-reload persistence within a session. No test framework is configured in this repo (`package.json` has no jest/vitest/testing-library) — do not add one for this feature. Verification is via `npx tsc --noEmit`, `npm run lint`, and manual browser checks against the running dev server.

## Global Constraints

- Remembered term lifetime: current browser session only (`sessionStorage`), not across browser restarts — matches `PlayerProvider`'s existing persistence lifetime.
- Clearing the search box and submitting empty clears the remembered term (Home link reverts to plain `/`).
- If Home ever renders with a term that differs from what's remembered (back/forward navigation, a bookmarked/typed URL), the remembered term is resynced to match what's on screen.
- No changes to `app/page.tsx`'s data-fetching logic.
- Out of scope: persisting across browser restarts (localStorage), scroll position restoration, remembering more than the single most recent term.

---

### Task 1: Add SearchProvider context

**Files:**
- Create: `context/SearchProvider.tsx`

**Interfaces:**
- Produces (context value, consumed by Tasks 2 and 3):
  - `lastTerm: string`
  - `setLastTerm(term: string): void`
  - `useSearch()` hook, mirroring the existing `usePlayer()` hook

- [ ] **Step 1: Create `context/SearchProvider.tsx`**

```tsx
/**
* Global search-term memory.
*
* - Stores the most recently searched term in React state.
* - Restores it from sessionStorage after reloads within the current
*   browser session.
* - Makes lastTerm and setLastTerm available through React Context so
*   layout-level components (which never remount on navigation) can stay
*   in sync with whatever the Home page is currently showing.
*
* Components such as SearchBar and PlayBar use the useSearch hook to
* read or update the remembered term.
*
* This provider is mounted in the root layout so search state can be
* shared across pages.
*/

"use client"

import { createContext, useContext, useState, useEffect } from "react"

type SearchContextType = {
  lastTerm: string
  setLastTerm: (term: string) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [lastTerm, setLastTermState] = useState("")

  useEffect(() => {
    const savedTerm = sessionStorage.getItem("last-search-term")

    if (savedTerm !== null) {
      setLastTermState(savedTerm)
    }
  }, [])

  function setLastTerm(term: string) {
    setLastTermState(term)
    sessionStorage.setItem("last-search-term", term)
  }

  return (
    <SearchContext.Provider value={{ lastTerm, setLastTerm }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) throw new Error("useSearch must be used inside SearchProvider")
  return context
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors. The file isn't imported anywhere yet, but it must still type-check on its own.

- [ ] **Step 3: Commit**

```bash
git add context/SearchProvider.tsx
git commit -m "feat: add SearchProvider for remembering the last search term"
```

---

### Task 2: Mount SearchProvider in the root layout

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `SearchProvider` from `@/context/SearchProvider` (Task 1).

- [ ] **Step 1: Wrap the existing providers with SearchProvider**

In `app/layout.tsx`, change:

```tsx
import MusicPlayer from "@/components/MusicPlayer";
import { PlayerProvider } from "@/context/PlayerProvider"
```

to:

```tsx
import MusicPlayer from "@/components/MusicPlayer";
import { PlayerProvider } from "@/context/PlayerProvider"
import { SearchProvider } from "@/context/SearchProvider"
```

and change:

```tsx
        <PlayerProvider>
          {children}
          <MusicPlayer />
        </PlayerProvider>
```

to:

```tsx
        <SearchProvider>
          <PlayerProvider>
            {children}
            <MusicPlayer />
          </PlayerProvider>
        </SearchProvider>
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount SearchProvider in root layout"
```

---

### Task 3: Sync the remembered term from SearchBar

**Files:**
- Modify: `components/SearchBar.tsx`

**Interfaces:**
- Consumes: `useSearch()` → `{ lastTerm, setLastTerm }` from Task 1 (only `setLastTerm` is needed here).

- [ ] **Step 1: Update SearchBar to keep the remembered term in sync**

Replace the full contents of `components/SearchBar.tsx`:

```tsx
/**
 * SEARCH BAR (Client Component)
 *
 * - Updates the URL client-side using the Next.js router.
 * - Does NOT fetch data itself.
 * - Keeps the remembered search term (SearchProvider) in sync so the
 *   sidebar's Home link can restore these results after navigating away.
 *
 * When submitted:
 * → The URL updates with ?term=value via router.push
 * → Next.js re-renders page.tsx without a full page reload,
 *   so playback in MusicPlayer isn't interrupted.
*/

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearch } from "@/context/SearchProvider"

interface SearchBarProps {
  defaultValue?: string
}

export default function SearchBar({ defaultValue }: SearchBarProps) {
  const router = useRouter()
  const { setLastTerm } = useSearch()

  /**
   * Keeps the remembered term truthful to whatever Home is actually
   * displaying right now — covers browser back/forward and any other
   * navigation that changes the URL's term without going through
   * handleSubmit below.
   */
  useEffect(() => {
    setLastTerm(defaultValue ?? "")
  }, [defaultValue, setLastTerm])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const term = new FormData(e.currentTarget).get("term") as string
    setLastTerm(term)
    router.push(`/?term=${encodeURIComponent(term)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto py-7 mb-10 flex items-stretch gap-2"
    >
      <label htmlFor="term" className="sr-only">
        Search songs
      </label>

      <input
        id="term"
        name="term"    /* IMPORTANT: becomes ?term=value in URL */
        type="text"
        autoComplete="off"    /* Prevents the browser's remembered-entries dropdown and inline suggestion, which render with colors our theme can't override */
        defaultValue={defaultValue}    /* Reflects current search */
        placeholder="Search for songs or artists…"
        className="flex-1 w-full rounded-xl px-6 py-2 text-[14px] bg-[var(--search-bg)] focus:outline-none focus:border border-[var(--current-border)]"
      />
    </form>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/SearchBar.tsx
git commit -m "feat: sync remembered search term from SearchBar"
```

---

### Task 4: Point the sidebar's Home link at the remembered term

**Files:**
- Modify: `components/PlayBar.tsx`

**Interfaces:**
- Consumes: `useSearch()` → `{ lastTerm }` from Task 1.

- [ ] **Step 1: Read lastTerm and build the Home link's href**

In `components/PlayBar.tsx`, change:

```tsx
import Link from "next/link"
import { usePathname } from "next/navigation"
import ScrollingText from "./ScrollingText"
```

to:

```tsx
import Link from "next/link"
import { usePathname } from "next/navigation"
import ScrollingText from "./ScrollingText"
import { useSearch } from "@/context/SearchProvider"
```

Then change:

```tsx
  const pathname = usePathname()

  const [theme, setTheme] = useState("dark")
```

to:

```tsx
  const pathname = usePathname()
  const { lastTerm } = useSearch()
  const homeHref = lastTerm ? `/?term=${encodeURIComponent(lastTerm)}` : "/"

  const [theme, setTheme] = useState("dark")
```

- [ ] **Step 2: Use homeHref on the Home link**

In `components/PlayBar.tsx`, change:

```tsx
            <Link href="/" className={`${navButton} ${pathname === "/" ? "bg-[var(--sidebar-active)]" : "bg-[var(--sidebar)]"}`}>
              Home
            </Link>
```

to:

```tsx
            <Link href={homeHref} className={`${navButton} ${pathname === "/" ? "bg-[var(--sidebar-active)]" : "bg-[var(--sidebar)]"}`}>
              Home
            </Link>
```

Note: the active-tab check (`pathname === "/"`) stays term-agnostic on purpose — Home should highlight as active regardless of which term is in the URL.

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: No errors.

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/PlayBar.tsx
git commit -m "feat: restore last search term when navigating home from the sidebar"
```

---

### Task 5: Manual end-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Verify the core round-trip**

Search for a term that returns multiple songs, click one to start playback, then click "Liked Songs" in the sidebar, then click "Home". Confirm the same search results reappear (not the unfiltered list) and the playing song is visibly part of that list again.

- [ ] **Step 3: Verify clearing the search**

With a term still active, clear the search box and submit an empty search. Navigate to Liked Songs and back to Home via the sidebar. Confirm Home now shows all songs and the sidebar's Home link is plain `/` (check via hovering the link or the address bar after clicking).

- [ ] **Step 4: Verify reload persistence**

Search for a term, navigate to Liked Songs, then reload the page (full browser refresh) while still on Liked Songs. Click "Home" in the sidebar. Confirm it still restores the earlier search term, not the unfiltered list.

- [ ] **Step 5: Verify back/forward resync**

Search for "a", then search for "b" (two entries in browser history). Use the browser's Back button to return to the "a" results. Navigate to Liked Songs, then click "Home" in the sidebar. Confirm it returns to "a" results (what was actually on screen), not "b" (what was last explicitly typed).

- [ ] **Step 6: Fix any issues found, then commit if changes were needed**

If Steps 2–5 all pass with no code changes, no commit is needed for this task.
