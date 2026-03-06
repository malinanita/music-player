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

import { createContext, useContext, useState } from "react"
import { Song } from "@/models/song"

type PlayerContextType = {
  currentSong: Song | null
  setCurrentSong: (song: Song) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)

  return (
    <PlayerContext.Provider value={{ currentSong, setCurrentSong }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider")
  return context
}