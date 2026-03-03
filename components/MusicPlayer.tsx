/**
* Client-side control component for the music player.
*
* - Stores player state (currentSong, isPlaying).
* - Handles song selection logic.
* - Passes state and event handlers down to child components.
*
* Structure:
* - SongGrid displays songs and triggers selection.
* - BottomBar reflects the current player state.
* 
* Doesn't handle actual audio playback.
*/

"use client"

import { useState } from "react"
import BottomBar from "./BottomBar"
import SongGrid from "./SongGrid"
import { Song } from "@/models/song"

interface MusicPlayerProps {
  songs: Song[];
}

export default function MusicPlayer({ songs }: MusicPlayerProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="ml-100">
      <SongGrid
        songs={songs}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
      />

      <BottomBar
        song={currentSong}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  )
}