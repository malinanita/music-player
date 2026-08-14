/**
* Sidebar player UI component.
*
* Responsibilities:
* - Displays the currently selected song (cover, title, artist).
* - Renders playback controls (play / pause / skip).
* - Shows navigation links (Home, Liked Songs) and theme toggle.
*
* This component does NOT manage playback logic itself.
* Instead, it receives all player state and control handlers via props
* from the MusicPlayer component.
*
* Props:
* - song: the currently selected song (or null if nothing is playing)
* - isPlaying: indicates whether the audio is currently playing
* - onPlay / onPause: event handlers that control playback
*
* The actual audio element and playback logic live in MusicPlayer.
*/

"use client"

import { useEffect, useState } from "react"
import { Song } from "@/models/song"
import Image from "next/image"
import { Play, Pause, SkipBack, SkipForward, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ScrollingText from "./ScrollingText"
import { useSearch } from "@/context/SearchProvider"

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

  const coverImage = song
  ? song.coverUrl ?? "/images/placeholder.jpg"
  : "/images/placeholder-noplay.png"

  const pathname = usePathname()
  const { lastTerm } = useSearch()
  const homeHref = lastTerm ? `/?term=${encodeURIComponent(lastTerm)}` : "/"

  const [theme, setTheme] = useState("dark")

  const navButton =
  "px-5 py-3 transition-all duration-200 ease-out md:rounded-t-xl hover:bg-[var(--nav-hover)] hover:-translate-y-0.5 hover:shadow-lg active:bg-[var(--nav-active)] active:translate-y-0";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") ?? "dark"
    setTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark"

    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  return (
    <div className="fixed z-50 bg-[var(--sidebar)] border-[var(--border-thin)]
        bottom-0 left-0 w-full h-24
        flex items-center justify-between px-10 py-3 border-t
        md:top-0 md:bottom-auto md:left-0 md:h-dvh md:w-100
        md:flex-col md:justify-center md:gap-6 md:p-6 md:pb-16
        md:border-t-0 md:border-r">

      {/* Song info */}
      <div className="flex items-center gap-3 md:flex-col md:gap-4">

        <div className="hidden md:block"> 
          <Image
            src={coverImage}
            alt={song?.title ?? "No song selected"}
            width={320}
            height={320}
            className="rounded-full border-8 border-[var(--border-thick)]
              w-[min(70vw,320px)] h-[min(70vw,320px)] object-cover 
              md:w-[clamp(220px,32vw,360px)] md:h-[clamp(220px,32vw,360px)]"
          />
        </div>

        <div className="text-left md:text-center max-w-38 md:max-w-56">
          <ScrollingText
            text={song?.title ?? "No song selected"}
            className="font-medium"
          />

          <ScrollingText
            text={song?.artist ?? "Select a song to play"}
            className="text-sm text-zinc-400"
          />
        </div>
      </div>

      {/* Play controls */}
      <div className="flex items-center justify-center gap-3 md:gap-6 md:py-4">
        <button
          onClick={onPrevious}
          disabled={disableNav}
          aria-label="Previous track"
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
          aria-label="Next track"
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white
            ${disableNav ? "bg-[#D6771F]/40 cursor-not-allowed" : "bg-[#D6771F]"}`}
        >
          <SkipForward size={20} />
        </button>
      </div>


      {/* Navigation and theme toggle */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center
                md:absolute md:top-auto md:bottom-0 md:left-0 md:w-full">
        <div className="flex rounded-b-xl overflow-hidden md:rounded-none md:overflow-visible">
          <nav className="flex">
            <Link href={homeHref} className={`${navButton} ${pathname === "/" ? "bg-[var(--sidebar-active)]" : "bg-[var(--sidebar)]"}`}>
              Home
            </Link>
            <Link href="/liked" className={`${navButton} ${pathname === "/liked" ? "bg-[var(--sidebar-active)]" : "bg-[var(--sidebar)]"}`}>
              Liked Songs
            </Link>
          </nav>
          <button onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="px-5 py-3
                  transition-all duration-200 ease-out
                  bg-[var(--sidebar)] md:rounded-t-xl
                  hover:bg-[var(--nav-hover)]
                  md:hover:rounded-t-xl
                  hover:-translate-y-0.5
                  hover:shadow-lg
                  active:bg-[var(--nav-active)]
                  md:active:rounded-t-xl
                  active:translate-y-0
                  flex items-center justify-center">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

    </div>
  )
}