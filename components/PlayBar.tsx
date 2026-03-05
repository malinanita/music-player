/**
 * Fixed bottom player UI.
 *
 * - Displays information about the selected song.
 * - Shows album cover, title and artist.
 * - Renders control buttons (play, pause, skip).
 *
 * Audio playback logic is handled separately.
 */

import { Song } from "@/models/song"
import Image from "next/image"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import Link from "next/link"

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
            <Link href="/" className="p-5">Home</Link>
            <Link href="/liked" className="p-5">Liked Songs</Link>
          </nav>
          <button className="p-5 hover:bg-black active:bg-gray-700">Theme</button>
        </div>
      </div>

    </div>
  )
}