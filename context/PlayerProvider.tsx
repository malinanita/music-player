/**
* Global player state provider.
*
* - Stores the currently selected song in React state.
* - Makes currentSong and setCurrentSong available to the entire app
*   through React Context.
*
* Components such as SongGrid and MusicPlayer use the usePlayer hook
* to access or update the global player state.
*
* This provider is mounted in the root layout so the player state
* persists across navigation between pages.
*/

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Song } from "@/models/song"

type PlayerContextType = {
  currentSong: Song | null
  shouldRestart: boolean
  setCurrentSong: (song: Song) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSongState] = useState<Song | null>(null)
  const [shouldRestart, setShouldRestart] = useState(false)

  useEffect(() => {
    const savedSong = localStorage.getItem("current-song")

    if (savedSong) {
      setCurrentSongState(JSON.parse(savedSong))
    }
  }, [])

  function setCurrentSong(song: Song, restart = true) {
    setCurrentSongState(song)
    setShouldRestart(restart)
    localStorage.setItem("current-song", JSON.stringify(song))
  }

  return (
    <PlayerContext.Provider value={{ currentSong, shouldRestart,setCurrentSong }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider")
  return context
}