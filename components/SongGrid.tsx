import { Song } from "@/models/song"
import SongCard from "./SongCard"

export default function SongGrid( { songs }: { songs: Song[] } ) {
  return (
    <section>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 max-w-5xl mx-auto">
        {songs.map((song) => (
          <li key={ song.id }>
            <SongCard song= { song }/>
          </li>
        ))}
      </ul>
    </section>
  )
}