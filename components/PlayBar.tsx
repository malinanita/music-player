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

import { Song } from "@/models/song"
import Image from "next/image"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

  const coverImage = song
  ? song.coverUrl ?? "/images/placeholder.jpg"
  : "/images/placeholder-noplay.png"

  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 h-screen w-100 flex flex-col justify-start pt-60 items-center bg-[#7D5A50] border-r border-zinc-700 p-6">

      {/* Song info */}
      <div className="flex flex-col items-center gap-4">

        <Image
          src={coverImage}
          alt={song?.title ?? "No song selected"}
          width={400}
          height={400}
          className="rounded-full border border-8 border-[#6C4A3C]/50"
        />

        <div className="text-center">
          <p className="font-medium">
            {song?.title ?? "No song selected"}
          </p>

          <p className="text-sm text-zinc-400">
            {song?.artist ?? "Select a song to play"}
          </p>
        </div>
      </div>

      {/* Play controls */}
      <div className="flex items-center justify-center gap-6 text-xl py-4">
        <button className="bg-[#D6771F] w-10 h-10 flex items-center justify-center rounded-full"><SkipBack size={20} /></button>
        <button onClick={isPlaying ? onPause : onPlay} className="bg-[#FFA857] w-15 h-15 flex items-center justify-center rounded-full">
          {isPlaying ? <Pause size={30} /> : <Play size={30} />}
        </button>        
        <button className="bg-[#D6771F] w-10 h-10 flex items-center justify-center rounded-full"><SkipForward size={20} /></button>
      </div>

      {/* Navigation and theme toggle */}
      <div className="fixed bottom-0">
        <div className="flex">
          <nav className="flex">
            <Link href="/" className={`px-5 py-3 transition-all duration-200 ease-out rounded-t-xl hover:bg-[#3e261b] hover:rounded-t-xl hover:-translate-y-0.5 hover:shadow-lg active:bg-[#2d1a12] active:rounded-t-xl ${pathname === "/" ? "bg-[#674940] rounded-t-xl" : "bg-[#7D5A50]"}`}>Home</Link>
            <Link href="/liked" className={`px-5 py-3 transition-all duration-200 ease-out rounded-t-xl hover:bg-[#3e261b] hover:rounded-t-xl hover:-translate-y-0.5 hover:shadow-lg active:bg-[#2d1a12] active:rounded-t-xl ${pathname === "/liked" ? "bg-[#674940] rounded-t-xl" : "bg-[#7D5A50]"}`}>Liked Songs</Link>
          </nav>
          <button className="px-5 py-3 transition-all duration-200 ease-out rounded-t-xl hover:bg-[#3e261b] hover:rounded-t-xl hover:-translate-y-0.5 hover:shadow-lg active:bg-[#2d1a12] active:rounded-t-xl">Theme</button>
        </div>
      </div>

    </div>
  )
}