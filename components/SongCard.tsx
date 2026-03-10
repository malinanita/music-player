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

"use client"

import Image from "next/image"
import { Song } from "@/models/song"
import { useState } from "react"
import { getLikes, toggleLike } from "@/lib/likes"

interface SongCardProps {
  song: Song;
  isCurrent?: boolean;
  setThisCurrentSong?: () => void;
}

export default function SongCard( { song, isCurrent, setThisCurrentSong }: SongCardProps) {
  
  const [likes, setLikesLocal] = useState(getLikes(song.id))

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation() // makes sure song doesn't play

    const newLikes = toggleLike(song.id)
    setLikesLocal(newLikes)
  }

  return (
    <div
      onClick={setThisCurrentSong}
      className={`p-4 rounded-xl cursor-pointer transition
        ${isCurrent ? "bg-[#271A14] border-3 border-yellow-700": "bg-[#271A14]"}
      `}
    >
      <Image 
        src={song.coverUrl ?? "/images/placeholder.jpg"} 
        alt=""
        width={300}
        height={300}
        className="w-80 h-80 object-cover"
      />

      <div className="flex justify-between items-center py-1">
        <div>
          <p className="py-1">{song.title}</p>
          <p className="text-sm text-zinc-400">{song.artist}</p>
        </div>

        <button onClick={handleLike}>
          {likes > 0 ? "❤️" : "🤍"}
        </button>
      </div>

    </div>
  )
   
}