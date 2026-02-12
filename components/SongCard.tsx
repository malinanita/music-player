/**
 * Presentational component that displays a single song.
 *
 * - Renders the song's cover image, title and artist.
 * - Visually indicates whether the song is currently selected.
 * - Notifies the parent component when clicked.
 *
 * Doesn't manage any state.
 * Selection state is controlled by the parent (MusicPlayer).
 */

import Image from "next/image"
import { Song } from "@/models/song"

interface SongCardProps {
  song: Song;
  isCurrent?: boolean;
  setThisCurrentSong?: () => void;
}

export default function SongCard( { song, isCurrent, setThisCurrentSong }: SongCardProps) {
  return (
    <div
      onClick={setThisCurrentSong}
      className={`p-4 rounded cursor-pointer transition
        ${isCurrent ? "bg-zinc-900 border-3 border-yellow-700" : "bg-zinc-800 hover:bg-zinc-700"}
      `}
    >
      <Image 
        src={song.coverUrl ?? "/images/placeholder.jpg"} 
        alt=""
        width={300}
        height={300}
        className="w-80 h-80 object-cover"
      />
      <p>{song.title}</p>
      <p className="text-sm text-zinc-400">{song.artist}</p>
    </div>
  )
   
}