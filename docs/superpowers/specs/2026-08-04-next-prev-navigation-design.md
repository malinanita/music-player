# Next / Previous Track Navigation — Design

## Goal

Wire up the existing (currently inert) `SkipBack` / `SkipForward` buttons in `PlayBar` so users can move to the previous/next track, and auto-advance to the next track when the current one finishes.

## Behavior

- **Queue source:** the list of songs a track was selected from (Home search results grid, or Liked Songs grid) becomes the active navigation queue. Clicking a song in a different grid replaces the queue.
- **Boundaries:** navigation wraps around — Next on the last song jumps to the first, Previous on the first jumps to the last.
- **Auto-advance:** when a track finishes playing naturally, playback automatically advances to the next track in the queue.
- **Disabled state:** Next/Previous buttons are disabled when the queue has 1 or fewer songs (nothing to navigate to).

## Changes

### `context/PlayerProvider.tsx`

- Add `queue: Song[]` state, restored from `sessionStorage` (new key `"queue"`) on mount alongside the existing `"current-song"` restore, so navigation keeps working across reloads.
- Change the public setter signature to `setCurrentSong(song: Song, queue?: Song[])`:
  - Always sets `currentSong` and `shouldRestart = true`.
  - Sets `queue` only when a queue argument is provided (song-grid clicks); otherwise the existing queue is left as-is (used internally by `playNext`/`playPrevious`).
  - Persists `currentSong` and `queue` to `sessionStorage`.
- Add `playNext()` and `playPrevious()`:
  - Find `currentSong`'s index in `queue` by `id`.
  - No-op if `currentSong` is null, `queue` is empty, index not found, or `queue.length <= 1`.
  - Otherwise compute the neighbor index with wraparound (`(index + 1) % queue.length` / `(index - 1 + queue.length) % queue.length`) and select that song via the internal setter, keeping the same queue.
- Expose `queue`, `playNext`, `playPrevious` on the context value.

### `components/SongGrid.tsx`

- Pass the currently rendered list as the queue on click: `setThisCurrentSong={() => setCurrentSong(song, songs)}`.

### `components/MusicPlayer.tsx`

- Read `queue`, `playNext`, `playPrevious` from `usePlayer()`.
- Pass `onNext={playNext}`, `onPrevious={playPrevious}`, and `disableNav={queue.length <= 1}` down to `PlayBar` (consistent with the existing pattern where `PlayBar` is presentation-only and receives handlers via props).
- Add an `onEnded={playNext}` handler to the `<audio>` element. Since `playNext` selects a new song with `shouldRestart = true`, the existing `currentSong`-change effect and `handleLoadedMetadata` flow will load and auto-play it — no new playback logic needed.

### `components/PlayBar.tsx`

- Add `onNext: () => void`, `onPrevious: () => void`, `disableNav?: boolean` props.
- Wire the `SkipBack` button to `onPrevious` and `SkipForward` button to `onNext`.
- Disable both buttons (and dim via existing disabled styling conventions) when `disableNav` is true.

## Out of scope

- Shuffle / repeat modes.
- A persistent, user-editable play queue UI.
- Cross-grid queues (e.g., merging Home + Liked Songs into one queue).
