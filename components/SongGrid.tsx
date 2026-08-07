/**
* Displays a responsive grid of SongCard components.
* 
* - Receives the list of songs from the parent page component.
* - Uses the global player context to determine the currently selected song.
* - When a song is clicked, it updates the global player state via setCurrentSong.
*
* This component doesn't manage its own state.
* It relies on PlayerProvider to access and update the current song.
*/

"use client"

import { Song } from "@/models/song"
import SongCard from "./SongCard"
import { usePlayer } from "@/context/PlayerProvider"

interface SongGridProps {
  songs: Song[];
}

export default function SongGrid({ songs }: SongGridProps) {

  const { currentSong, setCurrentSong } = usePlayer()

  return (
    <section>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 sm:gap-3 lg:gap-4 max-w-5xl mx-auto">
        {songs.map((song) => (
          <li key={ song.id }>
            <SongCard 
              song= { song }
              isCurrent={currentSong?.id === song.id}
              setThisCurrentSong={() => setCurrentSong(song, songs)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}