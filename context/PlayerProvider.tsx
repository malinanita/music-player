/**
* Global player state provider.
*
* - Stores the currently selected song in React state.
* - Stores the active navigation queue (the song list a track was
*   selected from) in React state.
* - Stores whether the selected song should restart from the beginning.
* - Restores the last selected song and queue from sessionStorage after
*   reloads within the current browser session.
* - Makes currentSong, shouldRestart, queue, setCurrentSong, playNext,
*   playPrevious and hasNext available through React Context.
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
  hasNext: () => boolean
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

  function hasNext(): boolean {
    if (!currentSong || queue.length <= 1) return false

    const index = queue.findIndex((s) => s.id === currentSong.id)
    return index !== -1 && index < queue.length - 1
  }

  return (
    <PlayerContext.Provider
      value={{ currentSong, shouldRestart, queue, setCurrentSong, playNext, playPrevious, hasNext }}
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