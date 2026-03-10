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

interface SongCardProps {
  song: Song;
  isCurrent?: boolean;
  setThisCurrentSong?: () => void;
}

export default function SongCard( { song, isCurrent, setThisCurrentSong }: SongCardProps) {
  
  const [liked, setLiked] = useState(false)

  /**
   * When the component mounts,
   * check if this song is already liked on the server
   */
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
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

    </div>
  )
   
}