/**
* Client-side control component for the music player.
*
* - Reads the currently selected song from the global PlayerProvider context.
* - Stores playback state locally (isPlaying).
* - Restores the last playback position from localStorage.
* - Controls audio playback through an HTMLAudioElement using a ref.
* 
* This component is rendered in the root layout so that the player state
* persists across page navigation.
*/

"use client"

import { useState, useRef, useEffect } from "react"
import PlayBar from "./PlayBar"
import { usePlayer } from "@/context/PlayerProvider"


export default function MusicPlayer() {
  const { currentSong } = usePlayer()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)

  /**
   * Restore saved playback position from localStorage.
   */
  useEffect(() => {
    const savedTime = localStorage.getItem("current-time")

    if (savedTime) {
      setCurrentTime(Number(savedTime))
    }
  }, [])
  
  /**
   * When the selected song from the global player context changes:
   * - update the audio source
   * - start playback automatically
   */
  useEffect(() => {
    if (!audioRef.current || !currentSong) return

    audioRef.current.src = currentSong.audioUrl
    audioRef.current.play()
    setIsPlaying(true)
  }, [currentSong])

  /**
   * When the play/pause state changes:
   * - control playback of the HTMLAudioElement
   */
  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function handleTimeUpdate() {
    if (!audioRef.current) return

    const time = audioRef.current.currentTime
    setCurrentTime(time)
    localStorage.setItem("current-time", String(time))
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) return

    audioRef.current.currentTime = currentTime
  }

  return (
    <div className="ml-100">

      <PlayBar
        song={currentSong}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <audio 
        ref={audioRef} 
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  )
}