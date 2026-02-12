/**
* Displays a responsive grid of SongCard components.
* 
* - Receives the list of songs from parent.
* - Receives the currently selected song.
* - Forwards selection state and click handlers to each SongCard.
*
* This component doesn't manage its own state.
* All state is controlled by the parent (MusicPlayer).
*/

import { Song } from "@/models/song"
import SongCard from "./SongCard"

interface SongGridProps {
  songs: Song[];
  currentSong?: Song | null;
  onCurrentSong?: (song: Song) => void;
}

export default function SongGrid({ songs, currentSong, onCurrentSong }: SongGridProps) {

  return (
    <section>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 max-w-5xl mx-auto">
        {songs.map((song) => (
          <li key={ song.id }>
            <SongCard 
              song= { song }
              isCurrent={currentSong?.id === song.id}
              onCurrent={() => onCurrentSong?.(song)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}