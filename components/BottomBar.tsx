/**
 * Fixed bottom player UI.
 *
 * - Displays information about the selected song.
 * - Shows album cover, title and artist.
 * - Renders control buttons (play, pause, skip).
 *
 * The component is rendered only when a song is selected.
 * Audio logic is handled separately.
 */

import { Song } from "@/models/song"
import Image from "next/image"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

interface BottomBarProps {
  song: Song | null;
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
}

export default function BottomBar({
  song,
  isPlaying,
  onPlay,
  onPause
}: BottomBarProps) {
  if (!song) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-zinc-700 p-4 flex items-center justify-between">
      
      {/* Left: song info */}
      <div className="flex items-center gap-4">
        <Image
          src={song.coverUrl ?? "/images/placeholder.jpg"}
          alt={song.title}
          width={50}
          height={50}
          className="rounded"
        />
        <div>
          <p className="font-medium">{song.title}</p>
          <p className="text-sm text-zinc-400">{song.artist}</p>
        </div>
      </div>

      {/* Center: controls */}
      <div className="flex gap-6 text-xl">
        <button><SkipBack size={20} /></button>
      <button onClick={isPlaying ? onPause : onPlay}>
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>        
      <button><SkipForward size={20} /></button>
      </div>

      {/* Right: placeholder */}
      <div className="w-[200px]" />

    </div>
  )
}