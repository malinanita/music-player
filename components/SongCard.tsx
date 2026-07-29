/**
 * Presentational component that displays a single song.
 *
 * - Renders the song's cover image, title and artist
 * - Shows if the song is liked
 * - Allows toggling like
 * - Notifies parent when clicked
*/

"use client"

import Image from "next/image"
import { Song } from "@/models/song"
import { useState, useEffect } from "react"
import { toggleLikeAction, isLikedAction } from "@/lib/actions"
import { Heart } from "lucide-react"

interface SongCardProps {
  song: Song;
  isCurrent?: boolean;
  setThisCurrentSong?: () => void;
}

export default function SongCard( { song, isCurrent, setThisCurrentSong }: SongCardProps) {
  
  const [liked, setLiked] = useState(false)

  //Check if song is already liked
  useEffect(() => {
    async function checkLiked() {
      const result = await isLikedAction(song.id)
      setLiked(result)
    }

    checkLiked()
  }, [song.id])

  
  //Toggle like state
  async function handleLike(e: React.MouseEvent) {
    e.stopPropagation()

    const newState = await toggleLikeAction(song)
    setLiked(newState)
  }

  return (
    <div
      onClick={setThisCurrentSong}
      className={`p-3 rounded-xl cursor-pointer transition
        ${isCurrent 
          ? "bg-[var(--card)] border-3 border-[var(--current-border)]": 
          "bg-[var(--card)]"
        }
      `}
    >
      <Image 
        src={song.coverUrl ?? "/images/placeholder.jpg"} 
        alt=""
        width={300}
        height={300}
        className="w-full aspect-square object-cover rounded-lg"
      />

      <div className="flex justify-between items-center py-2">
        <div className="min-w-0">
          <p className="truncate">
            {song.title}
          </p>
          <p className="text-sm text-zinc-400 truncate">
            {song.artist}
          </p>
        </div>

        <button onClick={handleLike} aria-label={liked ? "Unlike song" : "Like song"}>
          <Heart
            size={20}
            className={liked ? "text-red-500" : "text-zinc-400"}
            fill={liked ? "#ef4444" : "none"}
          />
        </button>
      </div>

    </div>
  )
}