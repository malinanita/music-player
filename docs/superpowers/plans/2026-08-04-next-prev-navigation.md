# Next / Previous Track Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up the existing (currently inert) Next/Previous buttons in `PlayBar` so users can navigate the queue of songs they clicked into, with wraparound and auto-advance on track end.

**Architecture:** `PlayerProvider` grows a `queue: Song[]` alongside `currentSong`, plus `playNext()`/`playPrevious()` that move through the queue by index (wrapping at the ends). `SongGrid` supplies the queue at click-time (the list it's rendering). `MusicPlayer` wires `playNext`/`playPrevious` into `PlayBar`'s props and into the `<audio>` element's `onEnded` event for auto-advance. `PlayBar` stays presentation-only, per the existing pattern documented in its file header.

**Tech Stack:** Next.js (App Router), React, TypeScript, sessionStorage for cross-reload persistence. No test framework is configured in this repo (`package.json` has no jest/vitest/testing-library) — do not add one for this feature. Verification is via `npx tsc --noEmit`, `npm run lint`, and manual browser checks against the running dev server.

## Global Constraints

- Queue source: the grid a song was clicked from (Home search results or Liked Songs) becomes the active queue; clicking in a different grid replaces it.
- Navigation wraps around at both ends.
- A finished track auto-advances to the next track in the queue.
- Next/Previous are disabled when the queue has 1 or fewer songs.
- No shuffle/repeat, no persistent queue-editing UI, no merged cross-grid queue — explicitly out of scope.

---

### Task 1: Add queue and navigation to PlayerProvider

**Files:**
- Modify: `context/PlayerProvider.tsx`

**Interfaces:**
- Consumes: `Song` type from `@/models/song` (existing).
- Produces (context value, consumed by Tasks 2 and 3):
  - `queue: Song[]`
  - `setCurrentSong(song: Song, queue?: Song[]): void` — signature change from the existing `setCurrentSong(song: Song, restart?: boolean): void`. The old `restart` param is removed; `shouldRestart` is now always set to `true` on selection (it was already always called with the default `true` everywhere in the codebase, so this is a no-op behavior change).
  - `playNext(): void`
  - `playPrevious(): void`

- [ ] **Step 1: Replace the contents of `context/PlayerProvider.tsx`**

```tsx
/**
* Global player state provider.
*
* - Stores the currently selected song in React state.
* - Stores the active navigation queue (the song list a track was
*   selected from) in React state.
* - Stores whether the selected song should restart from the beginning.
* - Restores the last selected song and queue from sessionStorage after
*   reloads within the current browser session.
* - Makes currentSong, shouldRestart, queue, setCurrentSong, playNext and
*   playPrevious available through React Context.
*
* Components such as SongGrid, SongCard and MusicPlayer use the usePlayer hook
* to access or update the global player state.
*
* This provider is mounted in the root layout so player state can be shared
* across pages.
*/

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Song } from "@/models/song"

type PlayerContextType = {
  currentSong: Song | null
  shouldRestart: boolean
  queue: Song[]
  setCurrentSong: (song: Song, queue?: Song[]) => void
  playNext: () => void
  playPrevious: () => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSongState] = useState<Song | null>(null)
  const [shouldRestart, setShouldRestart] = useState(false)
  const [queue, setQueue] = useState<Song[]>([])

  useEffect(() => {
    const savedSong = sessionStorage.getItem("current-song")
    const savedQueue = sessionStorage.getItem("queue")

    if (savedSong) {
      setCurrentSongState(JSON.parse(savedSong))
    }

    if (savedQueue) {
      setQueue(JSON.parse(savedQueue))
    }
  }, [])

  /**
   * Select a song to play.
   * When called with a queue (song-grid clicks), replaces the active
   * navigation queue. When called without one (playNext/playPrevious),
   * the existing queue is left as-is.
   */
  function setCurrentSong(song: Song, newQueue?: Song[]) {
    setCurrentSongState(song)
    setShouldRestart(true)
    sessionStorage.setItem("current-song", JSON.stringify(song))

    if (newQueue) {
      setQueue(newQueue)
      sessionStorage.setItem("queue", JSON.stringify(newQueue))
    }
  }

  function playNext() {
    if (!currentSong || queue.length <= 1) return

    const index = queue.findIndex((s) => s.id === currentSong.id)
    if (index === -1) return

    setCurrentSong(queue[(index + 1) % queue.length])
  }

  function playPrevious() {
    if (!currentSong || queue.length <= 1) return

    const index = queue.findIndex((s) => s.id === currentSong.id)
    if (index === -1) return

    setCurrentSong(queue[(index - 1 + queue.length) % queue.length])
  }

  return (
    <PlayerContext.Provider
      value={{ currentSong, shouldRestart, queue, setCurrentSong, playNext, playPrevious }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider")
  return context
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors. `queue` is an optional second parameter, so the existing single-argument call in `components/SongGrid.tsx` (`setCurrentSong(song)`) still type-checks — it just won't populate the queue yet, which Task 2 fixes.

- [ ] **Step 3: Commit**

```bash
git add context/PlayerProvider.tsx
git commit -m "feat: add navigation queue and playNext/playPrevious to PlayerProvider"
```

---

### Task 2: Supply the queue from SongGrid

**Files:**
- Modify: `components/SongGrid.tsx:34`

**Interfaces:**
- Consumes: `setCurrentSong(song: Song, queue?: Song[])` from Task 1.

- [ ] **Step 1: Update the click handler to pass the rendered list as the queue**

In `components/SongGrid.tsx`, change:

```tsx
              setThisCurrentSong={() => setCurrentSong(song)}
```

to:

```tsx
              setThisCurrentSong={() => setCurrentSong(song, songs)}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors (this was the only remaining caller of `setCurrentSong`).

- [ ] **Step 3: Commit**

```bash
git add components/SongGrid.tsx
git commit -m "feat: pass rendered song list as navigation queue on selection"
```

---

### Task 3: Wire Next/Previous and auto-advance into the player UI

**Files:**
- Modify: `components/MusicPlayer.tsx`
- Modify: `components/PlayBar.tsx`

**Interfaces:**
- Consumes: `queue`, `playNext`, `playPrevious` from `usePlayer()` (Task 1).
- Produces: `PlayBar` gains props `onNext: () => void`, `onPrevious: () => void`, `disableNav: boolean` — presentation-only, no new logic in `PlayBar`.

- [ ] **Step 1: Read `queue`, `playNext`, `playPrevious` in MusicPlayer and pass them to PlayBar**

In `components/MusicPlayer.tsx`, change:

```tsx
  const { currentSong, shouldRestart } = usePlayer()
```

to:

```tsx
  const { currentSong, shouldRestart, queue, playNext, playPrevious } = usePlayer()
```

and change the `<PlayBar ... />` usage from:

```tsx
      <PlayBar
        song={currentSong}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
```

to:

```tsx
      <PlayBar
        song={currentSong}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onNext={playNext}
        onPrevious={playPrevious}
        disableNav={queue.length <= 1}
      />
```

- [ ] **Step 2: Auto-advance when a track finishes**

In `components/MusicPlayer.tsx`, add an `onEnded` handler to the `<audio>` element. Change:

```tsx
      <audio 
        ref={audioRef} 
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />
```

to:

```tsx
      <audio 
        ref={audioRef} 
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />
```

`playNext` selects a new song with `shouldRestart` always `true`, so the existing `currentSong`-change effect (sets `audioRef.current.src`) and `handleLoadedMetadata` (seeks to 0, calls `.play()`) already handle loading and playing the next track — no other changes needed in `MusicPlayer`.

- [ ] **Step 3: Add nav props to PlayBar's interface and destructuring**

In `components/PlayBar.tsx`, change:

```tsx
interface PlayBarProps {
  song: Song | null;
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
}

export default function PlayBar({
  song,
  isPlaying,
  onPlay,
  onPause
}: PlayBarProps) {
```

to:

```tsx
interface PlayBarProps {
  song: Song | null;
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrevious: () => void
  disableNav: boolean
}

export default function PlayBar({
  song,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  disableNav
}: PlayBarProps) {
```

- [ ] **Step 4: Wire the SkipBack/SkipForward buttons**

In `components/PlayBar.tsx`, change:

```tsx
        <button className="bg-[#D6771F] text-white w-10 h-10 flex items-center justify-center rounded-full">
          <SkipBack size={20} />
        </button>
        <button onClick={isPlaying ? onPause : onPlay} className="bg-[#FFA857] text-white w-15 h-15 flex items-center justify-center rounded-full">
          {isPlaying ? <Pause size={30} /> : <Play size={30} />}
        </button>        
        <button className="bg-[#D6771F] text-white w-10 h-10 flex items-center justify-center rounded-full">
          <SkipForward size={20} />
        </button>
```

to:

```tsx
        <button
          onClick={onPrevious}
          disabled={disableNav}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white
            ${disableNav ? "bg-[#D6771F]/40 cursor-not-allowed" : "bg-[#D6771F]"}`}
        >
          <SkipBack size={20} />
        </button>
        <button onClick={isPlaying ? onPause : onPlay} className="bg-[#FFA857] text-white w-15 h-15 flex items-center justify-center rounded-full">
          {isPlaying ? <Pause size={30} /> : <Play size={30} />}
        </button>        
        <button
          onClick={onNext}
          disabled={disableNav}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white
            ${disableNav ? "bg-[#D6771F]/40 cursor-not-allowed" : "bg-[#D6771F]"}`}
        >
          <SkipForward size={20} />
        </button>
```

- [ ] **Step 5: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: No errors.

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add components/MusicPlayer.tsx components/PlayBar.tsx
git commit -m "feat: wire next/previous navigation and auto-advance into player UI"
```

---

### Task 4: Manual end-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Verify queue navigation from search results**

In the browser: search for a term that returns multiple songs, click the first song, then click Next repeatedly. Confirm playback moves through the grid in order and wraps from the last song back to the first. Click Previous from the first song and confirm it wraps to the last.

- [ ] **Step 3: Verify queue replacement across grids**

Play a song from the Home search results, then go to Liked Songs (with at least 2 liked songs) and click one. Confirm Next/Previous now navigate within the Liked Songs list, not the earlier search results.

- [ ] **Step 4: Verify disabled state**

Like exactly one song, go to Liked Songs, and play it. Confirm both Next and Previous buttons are visually dimmed and clicking them does nothing.

- [ ] **Step 5: Verify auto-advance**

Play a song from a queue of 2+ songs and let it play to completion (or manually seek near the end via devtools if the iTunes previews are long). Confirm playback automatically advances to the next track in the queue.

- [ ] **Step 6: Verify persistence across reload**

Select a song from a multi-song queue (not the first in the list), reload the page, then click Next. Confirm it advances relative to the correct position in the queue (i.e. the queue survived the reload), not just replaying the same song.

- [ ] **Step 7: Fix any issues found, then commit if changes were needed**

If Steps 2–6 all pass with no code changes, no commit is needed for this task.
