/**
* Client-side control component for the music player.
*
* - Reads the currently selected song and restart behavior from PlayerProvider.
* - Stores playback state locally with isPlaying.
* - Controls audio playback through an HTMLAudioElement using a ref.
* - Restores playback position from sessionStorage after reloads/search updates.
* - Playback state is preserved during the current browser session.
* 
* This component is rendered in the root layout so the player can continue
* across navigation between pages.
*/

"use client"

import { useState, useRef, useEffect } from "react"
import PlayBar from "./PlayBar"
import { usePlayer } from "@/context/PlayerProvider"


export default function MusicPlayer() {
  const { currentSong, shouldRestart, queue, playNext, playPrevious, hasNext } = usePlayer()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isRestoringTimeRef = useRef(false)

  /**
   * When the selected song changes:
   * - mark that playback position is being restored
   * - update the audio source
   * - wait for metadata before deciding whether to restart or restore time
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

  /**
   * Persist playback state so it can be restored after reloads.
   */
  useEffect(() => {
    sessionStorage.setItem("is-playing", String(isPlaying))
  }, [isPlaying])

  /**
  * Save the current playback position, except while a saved position
  * is being restored.
  */
  function handleTimeUpdate() {
    if (!audioRef.current || isRestoringTimeRef.current) return

    sessionStorage.setItem(
      "current-time",
      String(audioRef.current.currentTime)
    )
  }

  /**
  * Once audio metadata has loaded:
  * - restart from 0 if the song was selected manually
  * - otherwise restore the saved playback position
  * - start playback
  */
  function handleLoadedMetadata() {
    if (!audioRef.current) return

    const savedTime = sessionStorage.getItem("current-time")
    const wasPlaying = sessionStorage.getItem("is-playing") === "true"

    audioRef.current.currentTime = shouldRestart
      ? 0
      : savedTime
        ? Number(savedTime)
        : 0

    isRestoringTimeRef.current = false

    if (!wasPlaying && !shouldRestart) {
      setIsPlaying(false)
      return
    }

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(() => {
        setIsPlaying(false)
      })
  }

  /**
   * When a track finishes naturally, advance to the next queued song —
   * but don't wrap past the end of the queue the way manual Next does.
   */
  function handleEnded() {
    if (hasNext()) {
      playNext()
    } else {
      setIsPlaying(false)
    }
  }

  return (
    <div className="ml-100">

      <PlayBar
        song={currentSong}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onNext={playNext}
        onPrevious={playPrevious}
        disableNav={queue.length <= 1 || !currentSong}
      />

      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  )
}