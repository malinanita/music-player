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
  const { currentSong, shouldRestart } = usePlayer()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isRestoringTimeRef = useRef(false)

  /**
   * When the selected song from the global player context changes:
   * - update the audio source
   * - wait for metadata before restoring playback position
   */
  useEffect(() => {
    if (!audioRef.current || !currentSong) return

    isRestoringTimeRef.current = true
    audioRef.current.src = currentSong.audioUrl
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
    if (!audioRef.current || isRestoringTimeRef.current) return

    localStorage.setItem(
      "current-time",
      String(audioRef.current.currentTime)
    )
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) return

    const savedTime = localStorage.getItem("current-time")

    audioRef.current.currentTime = shouldRestart
      ? 0
      : savedTime
        ? Number(savedTime)
        : 0

    isRestoringTimeRef.current = false

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(() => {
        setIsPlaying(false)
      })
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